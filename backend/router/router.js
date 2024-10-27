import { Router } from "express";
import multer from "multer"
import { postDepartment, getDepartmentById, getEmployeesByDepartmentName, getEmployeeSurplusByDepartment, getAllDepartments, getDepartmentShortage, getDepartmentSurplus } from "../controllers/DepartmentController.js";
import { createAccount_admin, getAccountById, getAllAccounts, getAccountSurplus, login, signup, updateAccount, updateAccountSkills, deleteAccountSkills, getAccountByType, markAsExcess, createAccount_manager, changePassword } from "../controllers/AccountController.js";
import { deleteRequest, getAllRequests, getNotifications, getRequestById, postRequest, updateRequest } from "../controllers/RequestController.js";
import { deletePosition, fillPosition, getAllPositionsByDepartment, getPositionById, postPosition, updatePosition } from "../controllers/PositionController.js";
// import { getImageByName, uploadImage } from "../controllers/ImageController.js";
import { Admin_auth, Admin_or_manager, company_auth, Employee_auth, Manager_auth, verify_department } from "../authorize/authorize.js";
import { createCompany, getAllNotificationsByCompany, getAllPositionsByCompany } from "../controllers/CompanyController.js";

import OpenAI from "openai";

import dotenv from 'dotenv'
import Account from "../models/Account.js";
import Department from "../models/Department.js";
import Skills from "../models/Skills.js";
import { getSkills, postSkills } from "../controllers/SkillsController.js";
import Position from "../models/Position.js";
dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

const upload = multer({ dest: 'uploads/' })

const router = Router()

//--------------/    company   /---------------/

// router.post("/company", createCompany)
router.get("/company/:id/notification", getAllNotificationsByCompany)
router.get("/company/:id/position", getAllPositionsByCompany)

//--------------/    company  /---------------/

//--------------/    Image upload and retrive   /---------------/

// router.post("/upload", upload.single("image"), uploadImage)

// router.get('/image/:filename', getImageByName);

//--------------/    Image upload and retrive   - end  /---------------/


//--------------/    Account and login   /---------------/

router.post("/login", login)

router.post("/signup", signup)

router.get("/account/:id", company_auth, getAccountById)

router.get("/account", company_auth, Admin_auth, getAllAccounts)

router.delete("/account", company_auth, Admin_auth, getAllAccounts)

router.put("/account/:id", /*company_auth, Employee_auth,*/ updateAccount)

router.post("/createAccount", company_auth, Admin_or_manager /*Admin_auth*/, createAccount_admin)

router.get("/account/surplus", company_auth, getAccountSurplus)

router.patch("/account/skill/:id", company_auth, Employee_auth, updateAccountSkills)

router.delete("/account/skill/:id", company_auth, Employee_auth, deleteAccountSkills)

router.get("/account/type/:type", company_auth, Admin_auth, getAccountByType)

router.post("/createAccount/manager", Manager_auth, createAccount_manager)

router.put("/account/changepassword/:id", Employee_auth, changePassword)

//--------------/    Account and login - end  /---------------/

//--------------/    Request    /---------------/

router.get("/request", getAllRequests)


router.get("/request/:id", getRequestById)

router.put("/request/:id", updateRequest)

router.delete("/request/:id", deleteRequest)
router.get("/getNotifications/:id", getNotifications)



//--------------/    Request - end    /---------------/


//--------------/    Position    /---------------/

router.get("/position/:id", getPositionById)

router.get("/position/department/:id", getAllPositionsByDepartment)

router.post("/position", Manager_auth, verify_department, postPosition)

router.put("/position/:id", Manager_auth, updatePosition)

router.delete("/position/:id", Manager_auth, deletePosition)

router.post("/fillPosition", Admin_auth, fillPosition)

//--------------/    Position - end    /---------------/


//--------------/   Department   /---------------/

router.get("/department", getAllDepartments)

router.get("/department/id/:id", getDepartmentById)

router.get("/department/shortage", Admin_auth, getDepartmentShortage)

router.get("/department/surplus", Admin_auth, getDepartmentSurplus)

router.get("/department/:name/employees", Admin_auth, getEmployeesByDepartmentName)

router.get("/department/:name/employees/surplus", Admin_auth, getEmployeeSurplusByDepartment)

router.post("/department", Admin_auth, company_auth, postDepartment)

router.put("/account/excess/:id", markAsExcess)


//--------------/   Department - end  /---------------/

router.get("/skills", getSkills)

router.post("/skills", postSkills)

router.get("/chat/:id", async (req, res) => {
    //gpt-4o
    let { id } = req.params //id Of Position
   
    let position = await Position.findById(id)
    if (!position) return res.status(404).send({ msg: "Position not Found" })
    console.log(position.department.toString())
    let employees = await Account.find({ accountType: "employee", excess: true ,department:{$ne:position.department.toString()}}).populate("department")
    if (!employees || employees.length<=0) return res.status(404).send({ msg: "no surplus employees found" })
      

    let filtered = await employees.map(({ _doc }) => {

        let obj = {
            yearOfEXP: _doc.yearsOfExperience,
            currentJob: _doc.positionTitle,
            id: _doc._id,
            skills: _doc.skills,
            name: _doc.name,


        }
            return obj
    })

    console.log(filtered.length)
    console.log(position)
    console.log(filtered)
    //return    res.send(filtered)
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.3,
            messages: [
                { role: "system", content: "You are a recruiter with 20 years experience, head hunter with good experience in finding good employees  . You will be given a number of Employees and you'll pick the most suitable" },
                {
                    role: "user",
                    content: `pick the employees most fit based on the position in the qoutes below                      
                 your content should only contain 3 ID of the most fit employees seperated by a comma, NO spaces
                 you must return atleast one employee ID as a recommendation.

                Employees : 
                ${JSON.stringify(filtered)}
Position : "
position title: ${position.title}
Department: ${position.department.name}
Experience: ${position.experienceYears}
Estimated : ${position.expectedSalary}
Description : 
${position.description}"

i'll reitirate, you must return atleast one employee ID as a recommendation.

`,
                },
            ],
        });
        // let person = await Account.findById(completion.choices[0].message.content)
        // if (!person) return res.status(500).send({ msg: "Erroring, chatGBT returned an invalid ID" })
        let recommendations = completion.choices[0].message.content.split(",")
        console.log("content: " + completion.choices[0].message.content)
        let first_recommendation = await Account.findById(recommendations[0])
        let second_recommendation = await Account.findById(recommendations[1])
        let third_recommendation = await Account.findById(recommendations[2])


        return res.status(200).send([first_recommendation, second_recommendation, third_recommendation])
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error promphting chat GBT" }) }

})

export default router