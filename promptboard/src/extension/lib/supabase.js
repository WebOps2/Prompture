import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

window.supabase = supabase; // For debugging purposes, if needed in the browser console