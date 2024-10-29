import { postDepartment, getDepartmentById, getEmployeesByDepartmentName, getEmployeeSurplusByDepartment, getAllDepartments, getDepartmentShortage, getDepartmentSurplus } from "../controllers/DepartmentController.js";
import { Admin_auth,company_auth} from "../authorize/authorize.js";

import { Router } from "express";

const router = Router()

//    /department
router.get("", getAllDepartments)

router.get("/id/:id", getDepartmentById)

router.get("/shortage", Admin_auth, getDepartmentShortage)

router.get("/surplus", Admin_auth, getDepartmentSurplus)

router.get("/:name/employees", Admin_auth, getEmployeesByDepartmentName)

router.get("/:name/employees/surplus", Admin_auth, getEmployeeSurplusByDepartment)

router.post("", Admin_auth, company_auth, postDepartment)

export default router