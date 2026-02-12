import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

if (!OPENROUTER_API_KEY) {
  throw new Error("Missing OpenRouter API key");
}

export async function generateTasks(prompt: string) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Tasks Generator App",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("LLM Error:", error.response?.data || error.message);
    throw new Error("Failed to generate tasks from LLM");
  }
}
