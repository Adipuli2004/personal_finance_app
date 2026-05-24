import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { error } from "node:console";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey=  process.env.SUPABASE_SECRET_KEY;

if (!supabaseSecretKey||!supabaseUrl){
    throw new Error("Supabase Credential Missing")
}
export const supabaseClient = createClient(supabaseUrl,supabaseSecretKey);
