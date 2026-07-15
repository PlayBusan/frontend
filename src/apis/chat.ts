import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 개발용
});

export async function askChat(message: string) {
  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: message,
  });

  return response.output_text;
}