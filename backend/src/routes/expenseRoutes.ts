import {Router,Request,Response} from 'express';
import { supabaseClient } from '../config/supabase';
import { authenticatedRequest, requireAuth } from '../middleware/auth';
import { SupabaseClient } from '@supabase/supabase-js';

const expenseRouter = Router();

expenseRouter.get("/",(req:Request,res:Response) =>
    { 
        res.status(200).json(
            {
                status : "success",
                message : "Route to expensense APIs"
            }
        );
    }
)


// Fetch Dashboard API
expenseRouter.get("/dashboard",requireAuth,async (req:authenticatedRequest,res:Response) =>{
    try{
        const userId = req.userId;

        // extracting date from query or todays date
        const today = new Date();
        const month = req.query.month?parseInt(req.query.month as string):today.getMonth()+1;
        const year = req.query.year?parseInt(req.query.year as string):today.getFullYear();

        //fetching data
        let {data:monthlyTotals,error:fetchError} = await supabaseClient
        .from("monthly_totals")
        .select(`
            id,
            category_id,
            month,
            year,
            total,
            categories(id,category_name,pillar)
        `)
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)

        if (fetchError) throw fetchError;

        //checking if data row exists
        if (monthlyTotals && monthlyTotals.length>0){
            return res.status(200).json({
                status : "success",
                message:"rows found",
                data : monthlyTotals
            });
        }


        // fetching categories for seeding data if rows do not exits

        let {data:categoryData, error:categeoryError} = await supabaseClient
        .from("categories")
        .select("id")
        .eq("user_id",userId)
        .eq("is_active",true);

        if (categeoryError) throw categeoryError;

        // seed data into rows

        if (categoryData && categoryData.length>0){
            const seedData = categoryData.map(category => ({
                user_id: userId,
                category_id: category.id,
                month: month,
                year: year,
                total: 0.00
            }));

            let {error:insertError} = await supabaseClient
            .from("monthly_totals")
            .insert(seedData);

            if (insertError) throw insertError;

        }

        // refetch data
        let {data:refetchMonthlyTotals,error:refetchError} = await supabaseClient
        .from("monthly_totals")
        .select(`
            id,
            category_id,
            month,
            year,
            total,
            categories(id,category_name,pillar)
        `)
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)

        if (refetchError) throw refetchError;

        monthlyTotals = refetchMonthlyTotals;
        
        return res.status(200).json({
            status:"success",
            message:"rows initialised and seeded",
            data : monthlyTotals||[]
        });
    }

    catch(error:any){
        return res.status(500).json({
            status : "error",
            message : error||"failed to execute dashboard"
        })
    }


}
)

// Add Expense API

expenseRouter.post('/add-expense',requireAuth,async (req:authenticatedRequest,res:Response)=>{
    try{
        // reading from request
        const userId = req.userId;
        const amount = req.body.amount;
        const categoryId = req.body.categoryId;
        const today = new Date();
        const month = req.body.month?parseInt(req.body.month as string):today.getMonth()+1;
        const year = req.body.year?parseInt(req.body.year as string):today.getFullYear; 

        // Fetching current record
        const {data:currentRecord,error:fetchError} = await supabaseClient
        .from("monthly_totals")
        .select("total")
        .eq("user_id",userId)
        .eq("category_id",categoryId)
        .eq("month",month)
        .eq("year",year)
        .single()

        if (fetchError) throw fetchError;

        // Upserting New Total
        const newTotal = currentRecord.total + amount;
        const {data:upsertedRecord,error:upsertError} = await supabaseClient
        .from("monthly_totals")
        .upsert({
                user_id: userId,
                category_id: categoryId,
                month: Number(month),
                year: Number(year),
                total: newTotal
            },
            {onConflict: 'user_id,category_id,month,year'})
            .select()
            .single();

        if (upsertError) throw upsertError;
            
        return res.status(200).json({
            status : "success",
            message: "Succesfully Updated Data",
            data : {
                category_id: upsertedRecord.category_id,
                month: upsertedRecord.month,
                year: upsertedRecord.year,
                previous_total: currentRecord.total,
                new_total: upsertedRecord.total
            }
        });
    }
    catch (error){
        return res.status(500).json({
            status : "Errored",
            message : error||"add-expense API error"
        })
    }
})

// Reset Expense API

expenseRouter.patch("/reset-expense",requireAuth, async(req:authenticatedRequest,res:Response) =>{
    try{
        const userId = req.userId;
        const categoryId = req.body.categoryId;
        const today = new Date();
        const amount = req.body.amount?parseFloat(req.body.amount as string):0.0;
        const month = req.body.month?parseInt(req.body.month as string):today.getMonth()+1;
        const year = req.body.year?parseInt(req.body.year as string):today.getFullYear; 

        const {data:resetRecord,error:resetError} = await supabaseClient
        .from("monthly_totals")
        .update({'total':amount})
        .eq("user_id",userId)
        .eq("category_id",categoryId)
        .eq("month",month)
        .eq("year",year)
        .select().single();
        
        if (resetError) throw resetError;

        return res.status(200).json({
            status:"Success",
            data: {updatedAmount:resetRecord.total}
        })
    }
    catch (error){
        return res.status(500).json({
            status : "error",
            message : error||"reset-expense API failure"
        });
    }
}
)

export default expenseRouter;
