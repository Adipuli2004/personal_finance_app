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
        });
    }
    catch (error){
        return res.status(500).json({
            status: "errored",
            message: error.message || "active categories api failed"
        });
    }
})

// Delete category API
categoryRouter.patch("/delete-category",requireAuth,async(req:authenticatedRequest,res:Response)=>{
    try{
        const userId = req.userId;
        const categoryId = req.body.categoryId;
        
        let {data:categoryData, error:deleteError} = await supabaseClient
        .from("categories")
        .update({"is_active":false})
        .eq("user_id",userId)
        .eq("id",categoryId)
        .select();

        if (deleteError) throw deleteError;

        return res.status(201).json({
            status: "Success",
            message:"Succesfully deleted a category",
            data: categoryData
        });
    }
    catch(error){
        return res.status(500).json({
            status: "Errored",
            message: error.message || "Delete category API failed"
        });
    }
})

// Create or activate API
categoryRouter.patch('/create-category',requireAuth,async(req:authenticatedRequest,res:Response)=>{
    try{
        const userId = req.userId;
        const categoryName = req.body.categoryName.trim().toUpperCase();
        const pillar = req.body.pillar.trim().toUpperCase()


        let {data:createCategoryData, error: createCategoryError } = await supabaseClient
        .from("categories")
        .upsert({
            "user_id" : userId,
            "category_name":categoryName,
            "pillar" : pillar,
            "is_active": true
        },
        {onConflict:"user_id,pillar,category_name"})
        .select()
        .maybeSingle();

        if (createCategoryError) throw createCategoryError;

        return res.status(200).json({
            status: "Success",
            data: createCategoryData
        })
    }

    catch (error){
        return res.status(500).json({
            status: "Error",
            message: error.message || "Create Category API failure"
        });
    }
})


export default categoryRouter