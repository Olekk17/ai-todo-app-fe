import { useState } from "react";
import { analyzeLastNTodos } from "../api/ai";

export const useLastNTodosAnalysis = (n: number) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const msg = await analyzeLastNTodos(n);

      if (typeof msg !== "string") {
        throw new Error("Invalid response");
      }

      setMessage(msg);
    } catch (e) {
      console.error(e);
      setMessage("Failed to analyze todos");
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, message, handleAnalysis };
};
