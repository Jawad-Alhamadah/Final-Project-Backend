import { Router } from "express";
import { deleteRequest, getAllRequests, getRequestById, updateRequest } from "../controllers/RequestController.js";

const router = Router()

// /request

router.get("", getAllRequests)

router.get("/:id", getRequestById)

router.put("/:id", updateRequest)

router.delete("/:id", deleteRequest)

export default router
