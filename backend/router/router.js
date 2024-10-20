import { Router } from "express";
import multer from "multer"
import { postDepartment, getDepartmentById, getDepartmentsWithShortage, getDepartmentsWithSurplus, getEmployeesByDepartmentName, getEmployeeSurplusByDepartment, getAllDepartments } from "../controllers/DepartmentController.js";
import { getAccountById, getAllAccounts, login, signup } from "../controllers/AccountController.js";
import { deleteRequest, getAllRequests, getRequestByAccountIdReceiver, getRequestByAccountIdSender, getRequestById, postRequest, updateRequest } from "../controllers/RequestController.js";
import { deletePosition, getAllPositions, getPositionById, postPosition, updatePosition } from "../controllers/PositionController.js";
import { getImageByName, uploadImage } from "../controllers/ImageController.js";

const upload = multer({ dest: 'uploads/' })


const router = Router()


//--------------/    Image upload and retrive   /---------------/

router.post("/upload", upload.single("image"), uploadImage)

router.get('/image/:filename', getImageByName);

//--------------/    Image upload and retrive   - end  /---------------/


//--------------/    Account and login   /---------------/

router.post("/login", login)

router.post("/signup", signup)

router.get("/account/:id", getAccountById)

router.get("/account", getAllAccounts)



//--------------/    Account and login - end  /---------------/

//--------------/    Request    /---------------/

router.get("/request", getAllRequests)

router.get("/request/account/:id/sender", getRequestByAccountIdSender)

router.get("/request/account/:id/receiver", getRequestByAccountIdReceiver)

router.post("/request", postRequest)

router.get("/request/:id", getRequestById)

router.patch("/request/:id", updateRequest)

router.delete("/request/:id",deleteRequest)



//--------------/    Request - end    /---------------/


//--------------/    Position    /---------------/

router.get("/position/:id", getPositionById)

router.get("/position", getAllPositions)

router.post("/position", postPosition)

router.patch("/position/:id", updatePosition)

router.delete("/position/:id",deletePosition)

//--------------/    Position - end    /---------------/


//--------------/   Department   /---------------/

router.get("/department", getAllDepartments)

router.get("/department/id/:id", getDepartmentById)

router.get("/department/shortage", getDepartmentsWithShortage)

router.get("/department/surplus", getDepartmentsWithSurplus)

router.get("/department/:name/employees", getEmployeesByDepartmentName)

router.get("/department/:name/employees/surplus", getEmployeeSurplusByDepartment)

router.post("/department", postDepartment)



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