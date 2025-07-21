import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function backfillEmbeddings() {
  // 1. Fetch prompts with no embeddings
  const { data: prompts, error } = await supabase
    .from("prompts")
    .select("id, prompt")
    .is("embedding", null)
    .limit(1000); // Adjust batch size as needed

  if (error) {
    console.error("Error fetching prompts:", error);
    return;
  }

  for (const row of prompts) {
    try {
      // 2. Generate embedding for the prompt
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small", // or text-embedding-3-large
        input: row.prompt
      });


      const embedding = embeddingResponse.data[0].embedding;
      console.log("Embedding", embedding);

      // 3. Update the prompt with its embedding
      const { error: updateError } = await supabase
        .from("prompts")
        .update({ embedding })
        .eq("id", row.id);

      if (updateError) {
        console.error(`Failed to update prompt ${row.id}:`, updateError);
      } else {
        console.log(`Updated prompt ${row.id}`);
      }
    } catch (err) {
      console.error(`Error processing prompt ${row.id}:`, err.message);
    }
  }

  console.log("✅ Backfill complete for batch!");
}

backfillEmbeddings();
