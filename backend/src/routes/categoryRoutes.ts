import {Router,Response}  from "express"
import { supabaseClient } from '../config/supabase';
import { authenticatedRequest, requireAuth } from '../middleware/auth';

const categoryRouter = Router();

categoryRouter.get("/",(req:authenticatedRequest,res:Response)=>{
    return res.status(200).json({
        status: "Success",
        message : "Route to Category APIs"
    })
})

// Get active categories API
categoryRouter.get("/active-categories",requireAuth,async (req:authenticatedRequest,res:Response)=>{
    try{
        const userId = req.userId;
        
        let {data:categoryData,error:fetchError} = await supabaseClient
        .from("categories")
        .select("id,pillar,category_name")
        .eq("user_id",userId)
        .eq("is_active",true);

        if (fetchError) throw fetchError;

        return res.status(200).json({
            status: "Success",
            message: "Succesfully fetched active categories",
            data: categoryData
        })
    }
    catch (error){
        return res.status(500).json({
            status: "errored",
            message: error || "active categories api failed"
        })
    }
})

export default categoryRouter