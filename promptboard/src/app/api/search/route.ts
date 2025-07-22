
import { supabase } from "@/lib/supabase-client";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
    try{
        const { query, userId } = await request.json();
        if (!query || !userId) {
            return NextResponse.json({ error: "Missing query or userId" }, { status: 400 });
        }
         // ✅ Generate embedding for the search query
        const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query
        });
        const embedding = embeddingRes.data[0].embedding;

        const { data, error } = await supabase.rpc("match_prompts", {
            query_embedding: embedding,
            user_id: userId,
            similarity_threshold: 0.5, // Adjust threshold as needed
            match_count: 10 // Limit to top 10 results
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (data) {
            return NextResponse.json({ results: data }, { status: 200 });
        }

    }catch (error) {
        console.error("Error in search route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}