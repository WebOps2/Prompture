import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const openaiApiKey = process.env.OPENAI_API_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const openai = new OpenAI({ apiKey: openaiApiKey });
