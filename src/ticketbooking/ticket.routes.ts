import express from "express";
import type { Router } from "express";

import validate from "../comman/zod/validate.zod.js";

import { isauthenticated } from "../comman/auth.middleware.ts/auth.middlerware.js";


export const bookingRouter:Router=express.Router()

bookingRouter.get('',isauthenticated,async(req,res)=>{
res.json("ok")
})


