import { useState } from "react";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [model, setModel] = useState("custom");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSentiment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 p-6 border rounded-lg shadow-md bg-white flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
        <TextField 
          fullWidth
          label="Enter text here..." 
          variant="outlined"
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          className="mb-2"
        />
        <FormControl fullWidth className="mb-2">
          <InputLabel>Model</InputLabel>
          <Select value={model} onChange={(e) => setModel(e.target.value)}>
            <MenuItem value="custom">Custom</MenuItem>
            <MenuItem value="llama">llama</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={analyzeSentiment} 
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {result && (
          <div className="mt-4 p-3 border rounded-lg bg-gray-100">
            <p><strong>Sentiment:</strong> {result.sentiment}</p>
            <p><strong>Confidence:</strong> {result.confidence.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
