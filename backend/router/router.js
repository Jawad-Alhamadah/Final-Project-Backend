import { Router } from "express";
import multer from "multer"
import { createAccount_admin, login, signup, createAccount_manager } from "../controllers/AccountController.js";
import { getNotifications } from "../controllers/RequestController.js";
import { fillPosition } from "../controllers/PositionController.js";
import { Admin_auth, Admin_or_manager, company_auth, Manager_auth } from "../authorize/authorize.js";
import { getAllNotificationsByCompany, getAllPositionsByCompany } from "../controllers/CompanyController.js";
import Account from "../models/Account.js";
import bcrypt from "bcrypt"

import * as crypto from "node:crypto";
import  nodemailer from 'nodemailer';


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

router.post("/temporaryPassword",async (req,res)=>{

    let {email} = req.body
   
    let account = await  Account.find({email})
    if(!account || account.length<=0) return res.status(404).send({msg:"email does not exist"})
    account = account[0]

    const randPassword = await crypto.randomBytes(4).toString('hex');
    let randomhashPassword = await bcrypt.hash(randPassword,10)

    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user: process.env.GOOGLE_EMAIL,
            pass: process.env.GOOGLE_PASSWORD
       },tls: {
        rejectUnauthorized: false,
    },
    });

        var mailOptions = {
        from:process.env.GOOGLE_EMAIL,
        to: email,
        subject: 'This is Mergnet Team support, we sent you this message because you requested a password change',
        text:`
        at your request, we created a temporary password for you.
        Temporary Password: ${randPassword}

        If you did not request a password reset or have any questions, please contact our support team

        Best regards,
        MergeNet Support Team
        
        `
    }
    console.log("Sending mail")
    transporter.sendMail(mailOptions, async function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response)
            account.passwordChanged=false
            account.password = randomhashPassword

            await account.save()
        }
    })


   // console.log(process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASSWORD);
    // var transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for port 465, false for other ports
    //     auth: {
    //       user: process.env.GOOGLE_EMAIL,
    //       pass: process.env.GOOGLE_PASSWORD,
    //     },
    //     tls: {
    //         rejectUnauthorized: false, // Allows self-signed certificates
    //       },
    //   });
      
    //   var mailOptions = {
    //     from: process.env.GOOGLE_EMAIL,
    //     to: email,
    //     subject: 'your New Password ',
    //     text: randomhashPassword+'   -That was easy!'
    //   };
      
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    ///send
    
    
})
export default router