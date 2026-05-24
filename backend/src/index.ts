import express, { Request, Response } from 'express';
import { supabaseClient } from './config/supabase';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

console.log(PORT)
app.use(express.json());

// Base API

app.get('/',(req:Request, res:Response) => {
    res.status(200).json({status:"success",message:"Welcome to my finance app"});
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});