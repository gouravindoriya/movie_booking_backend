import type { Response,Request } from "express";
import ApiErrorResponse from '../comman/utils/api.errors.response.js'
import ApiResponse from "../comman/utils/api.response.js";
import {registerservice,loginservice} from './auth.service.js'
import ApiError from "../comman/utils/api.errors.js";

const register=async (req:Request,res:Response)=>{
    try {

        const {name,email,password}={...req.body}
        const result = await registerservice(name,email,password);
        return ApiResponse.created(res,"register done successfully", result)

    } catch (error) {
        if (error instanceof ApiError) {
            return ApiErrorResponse.custom(res,error.statusCode,error.message)
         }

        return ApiErrorResponse.internal(
        res,
         "Something went wrong. Please try again later."
    );
    
       
   
}
}


const login=async (req:Request,res:Response)=>{
     try {
       const {email,password}={...req.body}
                const result = await loginservice(email,password)

                return ApiResponse.ok(res,"login successful", result)

 } catch (error) {
        if (error instanceof ApiError) {
            return ApiErrorResponse.custom(res,error.statusCode,error.message)
         }

        return ApiErrorResponse.internal(
        res,
         "Something went wrong. Please try again later.")
    }
}


export default{
register,
login
}
