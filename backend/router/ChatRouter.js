
import { Router } from "express";
import { recommendEmployees } from "../controllers/ChatController.js";

const router = Router()

//  /chat
router.get("/:id", recommendEmployees)

export default router