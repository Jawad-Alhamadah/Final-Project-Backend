import { Router } from "express";
import multer from "multer"
import { postDepartment, getDepartmentById, getEmployeesByDepartmentName, getEmployeeSurplusByDepartment, getAllDepartments, getDepartmentShortage, getDepartmentSurplus } from "../controllers/DepartmentController.js";
import { createAccount, getAccountById, getAllAccounts, getAccountSurplus, login, signup, updateAccount, updateAccountSkills, deleteAccountSkills, getAccountByType, markAsExcess } from "../controllers/AccountController.js";
import { deleteRequest, getAllRequests, getRequestById, postRequest, updateRequest } from "../controllers/RequestController.js";
import { deletePosition, fillPosition, getAllPositions, getPositionById, postPosition, updatePosition } from "../controllers/PositionController.js";
// import { getImageByName, uploadImage } from "../controllers/ImageController.js";
import { Admin_auth, company_auth, Employee_auth, Manager_auth, verify_department } from "../authorize/authorize.js";
import { createCompany } from "../controllers/CompanyController.js";

import OpenAI from "openai";

import dotenv from 'dotenv'
import Account from "../models/Account.js";
import Department from "../models/Department.js";
dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });






const upload = multer({ dest: 'uploads/' })


const router = Router()

//--------------/    company   /---------------/

// router.post("/company", createCompany)

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

router.patch("/account/:id", /*company_auth, Employee_auth,*/ updateAccount)

router.post("/createAccount", company_auth, Admin_auth, createAccount)

router.get("/account/surplus", company_auth, getAccountSurplus)

router.patch("/account/skill/:id", company_auth, Employee_auth, updateAccountSkills)

router.delete("/account/skill/:id", company_auth, Employee_auth, deleteAccountSkills)

router.get("/account/type/:type", company_auth, Admin_auth, getAccountByType)

// router.get("/shortage",getShortage)

// router.get("/updateAccounts",async (req,res)=>{
//  await Request.updateMany({},{company:"671639be3a7e27df2d3fcaff"})
//  await Position.updateMany({},{company:"671639be3a7e27df2d3fcaff"})
//  await Department.updateMany({},{company:"671639be3a7e27df2d3fcaff"})
//  res.send("done")
// })



//--------------/    Account and login - end  /---------------/

//--------------/    Request    /---------------/

router.get("/request", getAllRequests)

// router.get("/request/account/:id/sender", getRequestByAccountIdSender)

// router.get("/request/account/:id/receiver", getRequestByAccountIdReceiver)

//router.post("/request", postRequest)

router.get("/request/:id", getRequestById)

router.patch("/request/:id", Admin_auth, updateRequest)

router.delete("/request/:id", Admin_auth, deleteRequest)



//--------------/    Request - end    /---------------/


//--------------/    Position    /---------------/

router.get("/position/:id", getPositionById)

router.get("/position", getAllPositions)

router.post("/position", Manager_auth, verify_department, postPosition)

router.patch("/position/:id", Admin_auth, updatePosition)

router.delete("/position/:id", Admin_auth, deletePosition)

router.post("/fillPosition", Admin_auth, fillPosition)

//--------------/    Position - end    /---------------/


//--------------/   Department   /---------------/

router.get("/department", getAllDepartments)

router.get("/department/id/:id", getDepartmentById)

// router.get("/department/shortage", getDepartmentsWithShortage)

// router.get("/department/surplus", getDepartmentsWithSurplus)

router.get("/department/shortage", Admin_auth, getDepartmentShortage)

router.get("/department/surplus", Admin_auth, getDepartmentSurplus)

router.get("/department/:name/employees", Admin_auth, getEmployeesByDepartmentName)

router.get("/department/:name/employees/surplus", Admin_auth, getEmployeeSurplusByDepartment)

router.post("/department", Admin_auth, company_auth, postDepartment)

router.patch("/account/excess/:id",markAsExcess)
//--------------/   Department - end  /---------------/


//Populate example: 
// let requests = await  Request.find().populate({ 
//     path: 'sender',
//     populate: {
//       path: 'department',
//       model: 'department'
//     } 
//  })

// let employees = await Account.aggregate([
//     {
//       $lookup: {
//         from: 'departments', 
//         localField: 'department',
//         foreignField: '_id',
//         as: 'departmentDetails'
//       }
//     },
//     {
//       $unwind: {
//         path: '$departmentDetails',
//         preserveNullAndEmptyArrays: true 
//       }
//     },
//     {
//       $match: {
//         'departmentDetails.name': name,
//         accountType: "employee"

//       }
//     }
//   ]);

router.patch("/updateAccounts",async (req,res)=>{
        let accounts = await Department.updateMany({aboutMe:"",description:""})
        res.send(accounts)
})

router.get("/chat", async (req, res) => {
    //gpt-4o
    
   let employees = await Account.find({accountType:"employee",excess:true}).populate("department")
   let filtered  = await employees.map(({_doc})=>{

    let {password,email,excess,department,__v,company,...rest}=_doc;
    //  rest.departmentName = _doc.department?.name
     
      return rest
    
    })
   
 //   res.send(filtered)
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a recruiter with 20 years experience, head hunter with good experience in finding good employees  . You will be given a number of Employees and you'll recommend the most suitable" },
            {
                role: "user",
                content: `i will give you a job in " " and your task is to analyze the position 
                then i will give you a list of employees, you task is to recommend one whos
                most qualified. 

                make your recommendeation concise.
                only return the name, the ID and the skills in this configiration 
                {name:{name Here}, id:{Id here} , skills:[{list of skills here}] }
                you must return atleast 1 person.

Position : "
We have an open position:

Web Frontend Engineer - JS, CSS, React, Flutter
Department: It
Job Type: Full-Time
Experience: 2 years
Estimated Salary: 16,000 SR


Many of our products have web front-ends. In order to create consistency across our products and sites, we have a central team that builds an open source React toolkit and presentation layer, the Vanilla Framework. We are excited to develop this further and see if we can help more open source projects build performant and accessible interfaces that respond well to diverse layouts. We use REST APIs for communication, and we consider API design an important part of the process.


What your day will look like

Write high-quality, well-designed software
Collaborate proactively with a globally distributed team
Display technical leadership internally and within our external communities
Debug issues and produce high-quality code to fix them
Contribute to technical documentation to make it the best of its kind
Discuss ideas and collaborate on finding good solutions
Work from home with global travel twice annually for company events

What we are looking for in you

An exceptional academic track record from both high school and university
Undergraduate degree in Computer Science or STEM, or a compelling narrative about your alternative path
Drive and a track record of going above-and-beyond expectations
Well-organised, self-starting and able to deliver to schedule
Professional manner interacting with colleagues, partners, and community
Knowledge of web (HTML, CSS and JS) tech
Fluency in Typescript, React or Flutter

"

Employees : 
${JSON.stringify(employees)}



`,
            },
        ],
    });

//     console.log(completion.choices);
return res.status(200).send(completion)

})

export default router