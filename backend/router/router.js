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
import nodemailer from 'nodemailer';


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

router.post("/changePassword", async (req, res) => {
    try {
        let { id, password } = req.body
        let account = await Account.findOne({ passwordLink: id })
        if (!account) return res.status(404).send({ msg: "ops... link doesn't exist" })

        let randomhashPassword = await bcrypt.hash(password, 10)
        account.password = randomhashPassword
        account.passwordChanged=true
        account.passwordLink=""
        await account.save()
        return res.status(200).send({ msg: "password changed" })


    }
    catch (err) {
        return res.status(500).send({ msg: "error changing password", err: err.message })

    }


})

router.post("/temporaryPassword", async (req, res) => {

    let { email } = req.body
    let account = await Account.findOne({ email })


    if (!account || account.length <= 0) return res.status(404).send({ msg: "email does not exist" })


    // const randPassword = await crypto.randomBytes(4).toString('hex');
    const randPassword = await crypto.randomBytes(40).toString('hex')
    // let randomhashPassword = await bcrypt.hash(randPassword,10)
    account.passwordLink = randPassword
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GOOGLE_EMAIL,
            pass: process.env.GOOGLE_PASSWORD
        }, tls: {
            rejectUnauthorized: false,
        },
    });

    var mailOptions = {
        from: process.env.GOOGLE_EMAIL,
        to: email,
        subject: 'This is Mergnet Team support, we sent you this message because you requested a password change',
        text: `
follow the link to change your password.

link: http://localhost:5173/changePassword/${randPassword}

If you did not request a password reset or have any questions, please contact our support team

    Best regards,
    MergeNet Support Team
        
        `
    }
    console.log("Sending mail")
    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response)
     
            try {
                await account.save()

                return res.status(200).send({ msg: "email sent" })
            } catch (err) {
                console.log(err.message); res.status(500).send({ msg: "cant save password", err: err.message })
            }

        }
    })

})
export default router