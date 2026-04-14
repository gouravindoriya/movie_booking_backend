
import express from "express";
import type { Router } from "express";
// import 
import authController from "./auth.controller.js";

import validate from "../comman/zod/validate.zod.js";
import { registerPayloadModal,loginPayloadModal } from "./zod/zod.modals.js";

export const authRouter:Router=express.Router()

authRouter.post('/register',validate(registerPayloadModal),authController.register)

authRouter.post('/login',validate(loginPayloadModal),authController.login)


