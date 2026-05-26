import {Request,Response,NextFunction} from 'express';

export interface authenticatedRequest extends Request{
    userId?:string;
}

export const requireAuth = async(req : authenticatedRequest, res: Response, next:NextFunction) => 
    {
        try{
            const MOCK_USER_ID = "MOCK USER ID";
            req.userId = MOCK_USER_ID;
            next();
        }
        catch(error){
            res.status(500).json({
                status:"error",
                message:"mock middleware error"
            });

        }
    }