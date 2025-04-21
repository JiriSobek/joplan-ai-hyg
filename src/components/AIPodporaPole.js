import { useState } from "react";

export default function AIPodporaPole() {
  const [text, setText] = useState("Pomáháme klientce s hygienou.");
  const [originalText, setOriginalText] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const callAI = async (action) => {
    setLoading(true);
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, action }),
    });
    const data = await res.json();
    if (action === "improve") {
      setOriginalText(text);
      setText(data.result);
    } else if (action === "comment") {
      setComment(data.result);
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
  };

  const handleUndo = () => {
    if (originalText) setText(originalText);
  };

  return (
    <div className="p-4 mx-auto" style={{ width: "725px", fontFamily: "sans-serif" }}>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={12}
        style={{ height: "280px", fontSize: "16px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex space-x-2 mb-4">
        <button
          className="px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: "#e36c5c" }}
          onClick={() => callAI("comment")}
        >
          Poradit
        </button>
        <button
          className="px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: "#e36c5c" }}
          onClick={() => callAI("improve")}
        >
          Vylepšit
        </button>
        <button
          className="px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: "#e36c5c" }}
          onClick={handleUndo}
        >
          Zpět
        </button>
        <button
          className="px-4 py-2 rounded-full text-white"
          style={{ backgroundColor: "#e36c5c" }}
          onClick={handleCopy}
        >
          Kopírovat
        </button>
      </div>

      {comment && (
        <div className="bg-gray-100 border p-3 rounded" style={{ fontSize: "16px" }}>
          <strong>Doporučení AI:</strong>
          <p className="mt-1 whitespace-pre-wrap">{comment}</p>
        </div>
      )}

      {loading && <p className="mt-4 text-sm text-gray-500">AI pracuje…</p>}
    </div>
  );
}
