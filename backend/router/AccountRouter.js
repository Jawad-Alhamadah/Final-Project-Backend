
import { Router } from "express";
import { Admin_auth, Admin_or_manager, company_auth, Employee_auth, Manager_auth, verify_department } from "../authorize/authorize.js";
import { createAccount_admin, getAccountById, getAllAccounts, getAccountSurplus, login, signup, updateAccount, updateAccountSkills, deleteAccountSkills, getAccountByType, markAsExcess, createAccount_manager, changePassword } from "../controllers/AccountController.js";

const router = Router()

router.get("/:id", company_auth, getAccountById)

router.get("", company_auth, Admin_auth, getAllAccounts)

router.delete("", company_auth, Admin_auth, getAllAccounts)

router.put("/:id", /*company_auth, Employee_auth,*/ updateAccount)

// router.post("/createAccount", company_auth, Admin_or_manager /*Admin_auth*/, createAccount_admin)

router.get("/surplus", company_auth, getAccountSurplus)

router.patch("/skill/:id", company_auth, Employee_auth, updateAccountSkills)

router.delete("/skill/:id", company_auth, Employee_auth, deleteAccountSkills)

router.get("/type/:type", company_auth, Admin_auth, getAccountByType)

// router.post("/createAccount/manager", Manager_auth, createAccount_manager)

router.put("/changepassword/:id", Employee_auth, changePassword)

router.put("/excess/:id", markAsExcess)


export default router