import {Router,Request,Response} from 'express';
import { supabaseClient } from './config/supabase';

const expenseRouter = Router();


expenseRouter.get("/",(req:Request,res:Response) =>
    { 
        res.status(200).json(
            {
                status : "success",
                message : "New Route to expensense"
            }
        );
    }
)

expenseRouter.get("/dashboard",(req:Request,res:Response) =>
    {
        try {
            res.status(200).json(
                {
                    status : "success",
                    message : "New Route to expensense dashboard with supabase"
                }
            );
        }

        catch (error){
            res.status(500).json(
                {
                    status : "Error",
                    message:"Internal Server Error"
                }
            );
        }
    }
)

export default expenseRouter;
