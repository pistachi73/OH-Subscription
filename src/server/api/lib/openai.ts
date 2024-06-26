import { env } from "@/env";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { data } = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });

  return data[0]?.embedding as number[];
};
