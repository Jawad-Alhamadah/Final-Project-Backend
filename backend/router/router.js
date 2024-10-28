import { Router } from "express";
import multer from "multer"
import { createAccount_admin,login, signup, createAccount_manager } from "../controllers/AccountController.js";
import { getNotifications} from "../controllers/RequestController.js";
import { fillPosition } from "../controllers/PositionController.js";
import { Admin_auth, Admin_or_manager, company_auth, Manager_auth} from "../authorize/authorize.js";
import { getAllNotificationsByCompany, getAllPositionsByCompany } from "../controllers/CompanyController.js";


const upload = multer({ dest: 'uploads/' })

const router = Router()


// router.post("/company", createCompany)
router.get("/company/:id/notification", getAllNotificationsByCompany)
router.get("/company/:id/position", getAllPositionsByCompany)


router.post("/login", login)

router.post("/signup", signup)

router.post("/createAccount", company_auth, Admin_or_manager /*Admin_auth*/, createAccount_admin)

router.post("/createAccount/manager", Manager_auth, createAccount_manager)


router.get("/getNotifications/:id", getNotifications)



router.post("/fillPosition", Admin_auth, fillPosition)


export default router