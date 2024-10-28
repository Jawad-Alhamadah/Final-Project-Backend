import { deletePosition, fillPosition, getAllPositionsByDepartment, getPositionById, postPosition, updatePosition } from "../controllers/PositionController.js";
import { Admin_auth, Admin_or_manager, company_auth, Employee_auth, Manager_auth, verify_department } from "../authorize/authorize.js";

import { Router } from "express";

const router = Router()


 //  /position 
router.get("/:id", getPositionById)

router.get("/department/:id", getAllPositionsByDepartment)

router.post("", Manager_auth, verify_department, postPosition)

router.put("/:id", Manager_auth, updatePosition)

router.delete("/:id", Manager_auth, deletePosition)

export default router