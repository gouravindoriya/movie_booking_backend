import type { Request, Response, NextFunction } from 'express';
import type { ZodObject, ZodTypeAny } from 'zod';
import ApiErrorResponse from '../utils/api.errors.response.js'


function validate(modal: ZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
            try {
            const validationResult = await modal.safeParseAsync(req.body)
          
            if(!validationResult.success){
                return ApiErrorResponse.badRequest(res ,"it should be valid schema")
            }
            req.body=validationResult.data
            next();
            } catch (error) {
                return ApiErrorResponse.internal(res,"there is some problem in the register a user")
            }
    }
}

export default validate
