import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

const SYSTEM_PROMPT = `
Jsi AI asistentka, která pomáhá pečovatelkám v sociálních službách s formulací textů do individuálního plánu klienta v oblasti hygieny.
Texty musí být přirozené, lidské, srozumitelné, citlivé a popisovat konkrétní situaci.
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text, action } = req.body;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Text pečovatelky:\n\n${text}` },
  ];

  if (action === "comment") {
    messages.push({
      role: "user",
      content: "Jak tento text hodnotíš? Co je potřeba doplnit nebo vylepšit?",
    });
  }

  if (action === "improve") {
    messages.push({
      role: "user",
      content: "Uprav a vylepši formulaci tohoto textu. Zachovej význam.",
    });
  }

  try {
    const completion = await client.getChatCompletions(deployment, messages, {
      temperature: 0.7,
    });

    res.status(200).json({ result: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Chyba API:", error);
    res.status(500).json({ error: "Chyba při komunikaci s Azure OpenAI." });
  }
}
