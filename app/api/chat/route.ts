import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL, // https://api.deepseek.com/v1
  name: "deepseek", // 可选：让 provider 名字更贴切
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // DeepSeek 走 chat/completions，更兼容
    model: deepseek.chat(process.env.DEEPSEEK_MODEL ?? "deepseek-chat"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
