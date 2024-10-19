import { Router } from "express";
import Account from "../models/Account.js";
import Department from "../models/Department.js";
import Position from "../models/Position.js";
import Request from "../models/Request.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import axios from "axios"

import  admin from 'firebase-admin'
import  serviceAccount from '../../final-project-1b8b6-firebase-adminsdk-ygxud-1484d01997.json' assert { type: 'json' };
import multer from "multer"
const upload = multer({ dest: 'uploads/' })
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'final-project-1b8b6.appspot.com'


});

const bucket = admin.storage().bucket();

const router = Router()


router.post("/upload",upload.single("image"),async (req,res)=>{
    let file_path = req.file.path
    let file_destination  = `${Date.now()}_${req.file.originalname}}`

 
    try{
    let result = await bucket.upload(file_path, {
        file_destination,
        gzip: true,
        metadata: {
            cacheControl: 'public,max-age=31536000',
        },

      
    })
    
    res.status(200).send(`${file_destination}`)
}
catch(err){console.log(err); res.status(500).send("err")}

})


router.get('/image/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = `${filename}`;
    console.log(filePath)
    try {
        const file = await bucket.file(filePath);
        const [exists] = await file.exists();
        console.log(file)
        
        if (!exists) {
            return res.status(404).send({ message: 'Image not found' });
        }
        
       
        const options = {
            version: 'v2', 
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, 
        };

        const [url] = await file.getSignedUrl(options);
        res.status(200).send({ url });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving image', error });
    }
});



router.get("/department", async (req, res) => {

    try {
        let departments = await Department.find()
        if (!departments) return res.status(404).send("no department found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }


})


router.get("/account", async (req, res) => {
    let accounts = await Account.find().populate("department")
    res.send(accounts)
})

router.get("/department/shortage", async (req, res) => {

    try {
        let departments = await Department.find({ status: "shortage" }).populate("employees")
        if (!departments) return res.status(404).send("no department found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }


})


router.get("/department/surplus", async (req, res) => {

    try {
        let departments = await Department.find({ status: "surplus" }).populate("employees")
        if (!departments) return res.status(404).send("no department found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }


})


router.post("/login", async (req, res) => {
    let { email, password } = req.body

    try {
        let account = await Account.findOne({ email })
        if (!account) return res.status(404).send({ msg: "Email not found" })
        let isMatched = await bcrypt.compare(password, account.password)
        if (!isMatched) return res.status(400).send({ msg: "incorrect password" })

        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        res.status(200).send({ msg: "login succesful", name: account.name, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to login" }) }




})


router.post("/signup", async (req, res) => {
    let { email, password, name } = req.body

    try {
        let old_account = await Account.findOne({ email })
        if (old_account) return res.status(400).send({ msg: "Email Already Exists" })

        let account = new Account({
            email,
            password,
            accountType: "employee",
            department: null,
            name

        })

        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        account.save().catch(err => console.log(err.message))
        res.status(200).send({ msg: "Signup sucessful", name: account.name, id: account._id, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to login" }) }

})






router.get("/position", async (req, res) => {

    try {
        let positions = await Position.find()
        if (!positions) return res.status(404).send("no position found")
        res.status(200).send(positions)

    }
    catch (err) { res.status(500).send({ msg: "Error getting position" }) }


})


router.get("/request", async (req, res) => {
    try {
        let requests = await Request.find()
        if (!requests) return res.status(404).send("no position request found")
        res.status(200).send(requests)
    }
    catch (err) { res.status(500).send({ msg: "Error getting notification request" }) }

})


//By Id paths

router.get("/department/:id", async (req, res) => {
    try {
        let { id } = req.params
        let departments = await Department.findById(id)
        if (!departments) return res.status(404).send("department not found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting record" }) }

})



router.get("/account/:id", async (req, res) => {
    try {
        let { id } = req.params
        let accounts = await Account.findById(id).populate("department")
        if (!accounts) return res.status(404).send("account not found")
        let { name, accountType, excess, department } = accounts
        return res.status(200).send({ name, accountType, excess, department })
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

})


router.get("/position/:id", async (req, res) => {
    try {
        let { id } = req.params
        let positions = await Position.findById(id)
        if (!positions) return res.status(404).send("position not found")
        return res.status(200).send(positions)
    }
    catch (err) { res.status(500).send({ msg: "Error getting record" }) }

})


router.get("/request/:id", async (req, res) => {
    try {
        let { id } = req.params
        let requests = await Request.findById(id)
        if (!requests) return res.status(404).send("position request not found")
        return res.status(200).send(requests)
    }
    catch (err) { res.status(500).send({ msg: "Error getting record" }) }

})


router.get("/department/:name/employees", async (req, res) => {
    let { name } = req.params

    let department = await Department.findOne({ name });
    if (!department) return res.status(404).send({ msg: "Department Not Found" })

    let employees = await Account.find({ department }).populate("department")

    if (!employees) return res.send({ msg: `${name} has no employees` })

    res.send(employees)
})



router.get("/department/:name/employees", async (req, res) => {
    let { name } = req.params

    let department = await Department.findOne({ name });
    if (!department) return res.status(404).send({ msg: "Department Not Found" })

    let employees = await Account.find({ department }).populate("department")

    if (!employees) return res.send({ msg: `${name} has no employees` })

    res.send(employees)
})




router.get("/department/:name/employees/surplus", async (req, res) => {
    let { name } = req.params

    let department = await Department.findOne({ name });
    if (!department) return res.status(404).send({ msg: "Department Not Found" })

    let employees = await Account.find({ department, excess: true }).populate("department")

    if (!employees || employees.length <= 0) return res.send({ msg: ` No surplus employees in ${name}` })

    res.send(employees)
})


router.post("/department", async (req, res) => {
    let { name, empNum, managerName, password, email, limit } = req.body

    let new_manager = await axios.post("http://localhost:3000/signup", {
        email,
        password,
        name: managerName

    }).catch(err => { res.status(500).send({ msg: err.response.data.msg }); return null })

    if (!new_manager?.data) return

    new_manager = new_manager.data
    let status
    if (limit > empNum) status = "shortage"
    if (limit < empNum) status = "surplus"
    if (limit === empNum) status = "normal"
    let check_department = await Department.find({ name })
    if (check_department) return res.status(400).send({ msg: "department already exists" })
    let new_department = await new Department({
        name,
        empNum,
        status: status,
        manager: new_manager.id,
        "employees": null,
        limit,
        "neededEmployees": [],
        "positions": [],
    })

    try {
        await new_department.save()
        return res.status(200).send(new_department)

    }
    catch (err) { return res.status(500).send({ msg: "error creating department" }) }




    // let department = await Department.findOne({ name });
    // if (!department) return res.status(404).send({ msg: "Department Not Found" })

    // let employees = await Account.find({ department,excess:true}).populate("department")

    // if (!employees || employees.length<=0) return res.send({msg:` No surplus employees in ${name}`})

    // res.send(employees)
})


// router.get("/department/:name/employees/shortage", async (req, res) => {
//     let { name } = req.params

//     let department = await Department.findOne({ name });
//     if (!department) return res.status(404).send({ msg: "Department Not Found" })

//     let employees = await Account.find({ department,excess:false}).populate("department")
//     console.log(employees)
//     if (!employees || employees.length<=0) return res.send({msg:` No surplus employees in ${name}`})

//     res.send(employees)
// })

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