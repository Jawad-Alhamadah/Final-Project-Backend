import { deletePosition, getAllPositionsByDepartment, getPositionById, postPosition, updatePosition } from "../controllers/PositionController.js";
import { Manager_auth, verify_department } from "../authorize/authorize.js";

import { Router } from "express";

const router = Router()


//  /position 
router.get("/:id", getPositionById)

router.get("/department/:id", getAllPositionsByDepartment)

router.post("", Manager_auth, verify_department, postPosition)

router.put("/:id", Manager_auth, updatePosition)

router.delete("/:id", Manager_auth, deletePosition)

export default router