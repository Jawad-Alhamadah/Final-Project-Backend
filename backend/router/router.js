import { Router } from "express";
import multer from "multer"
import { postDepartment, getDepartmentById, getEmployeesByDepartmentName, getEmployeeSurplusByDepartment, getAllDepartments, getDepartmentShortage, getDepartmentSurplus } from "../controllers/DepartmentController.js";
import { createAccount, getAccountById, getAllAccounts, getAccountSurplus, login, signup, updateAccount, updateAccountSkills, deleteAccountSkills } from "../controllers/AccountController.js";
import { deleteRequest, getAllRequests, getRequestById, postRequest, updateRequest } from "../controllers/RequestController.js";
import { deletePosition, fillPosition, getAllPositions, getPositionById, postPosition, updatePosition } from "../controllers/PositionController.js";
// import { getImageByName, uploadImage } from "../controllers/ImageController.js";
import { Admin_auth, company_auth, Employee_auth, Manager_auth, verify_department } from "../authorize/authorize.js";
import { createCompany } from "../controllers/CompanyController.js";

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

router.patch("/account/:id", company_auth, Employee_auth, updateAccount)

router.post("/createAccount", company_auth,Admin_auth, createAccount)

router.get("/account/surplus", company_auth, getAccountSurplus)

router.patch("/account/skill/:id", company_auth,Employee_auth,updateAccountSkills)

router.delete("/account/skill/:id", company_auth,Employee_auth,deleteAccountSkills)

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

router.post("/position", Manager_auth,verify_department,postPosition)

router.patch("/position/:id", Admin_auth, updatePosition)

router.delete("/position/:id", Admin_auth, deletePosition)

router.post("/fillPosition",Admin_auth,fillPosition)

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

router.post("/department", Admin_auth,company_auth, postDepartment)

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


export default router