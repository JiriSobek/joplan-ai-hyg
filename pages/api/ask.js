export default async function handler(req, res) {
  const { text, action } = req.body;

  const endpoint = "https://sobek-m9qsyt10-switzerlandcentral.openai.azure.com/";
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = "joplan-ai-gpt-4o";

  const promptComment = `Toto je textový popis podpory klienta v oblasti hygieny. Napiš, co je na textu dobře a co je potřeba vylepšit nebo doplnit, aby byl konkrétní a srozumitelný. Piš stručně a jasně.
Text: """${text}"""`;

  const promptImprove = `Toto je textový popis podpory klienta v oblasti hygieny. Uprav ho tak, aby byl konkrétní, psaný jednoduše a srozumitelně i pro člověka s lehkou demencí nebo mentálním postižením. Používej běžnou mluvu.
Text: """${text}"""`;

  const prompt = action === "comment" ? promptComment : promptImprove;

  try {
    const response = await fetch(`${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2024-03-01-preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "AI nedokázala odpovědět.";
    res.status(200).json({ result });
  } catch (error) {
    console.error("Chyba volání Azure:", error);
    res.status(500).json({ result: "Došlo k chybě při volání Azure OpenAI." });
  }
}
