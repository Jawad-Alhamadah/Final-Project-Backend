
import { Router } from "express";
import { Admin_auth, company_auth, Employee_auth } from "../authorize/authorize.js";
import { getAccountById, getAllAccounts, getAccountSurplus, updateAccount, updateAccountSkills, deleteAccountSkills, getAccountByType, markAsExcess, changePassword } from "../controllers/AccountController.js";

const router = Router()

router.get("/:id", company_auth, getAccountById)

router.get("", company_auth, Admin_auth, getAllAccounts)

router.delete("", company_auth, Admin_auth, getAllAccounts)

router.put("/:id", /*company_auth, Employee_auth,*/ updateAccount)

router.get("/surplus", company_auth, getAccountSurplus)

router.patch("/skill/:id", company_auth, Employee_auth, updateAccountSkills)

router.delete("/skill/:id", company_auth, Employee_auth, deleteAccountSkills)

router.get("/type/:type", company_auth, Admin_auth, getAccountByType)

router.put("/changepassword/:id", Employee_auth, changePassword)

router.put("/excess/:id", markAsExcess)


export default router