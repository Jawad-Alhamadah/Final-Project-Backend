import Account from "../models/Account.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function deleteByAccount(req, res) {
    try {
        let { id } = req.params
        let accounts = await Account.findByIdAndDelete(id).populate("department")
        if (!accounts) return res.status(404).send("account not found")
        let { name, accountType, excess, department } = accounts
        return res.status(200).send({ name, accountType, excess, department })
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}

export async function getAccountById(req, res) {

    try {
        let { id } = req.params
        let accounts = await Account.findById(id).populate("department")
        if (!accounts) return res.status(404).send("account not found")
        let { name, accountType, excess, department } = accounts
        return res.status(200).send({ name, accountType, excess, department })
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}

export async function getAllAccounts(req, res) {
    let accounts = await Account.find()//.populate("department")
    //
    res.send(accounts)
}

export async function getAccountSurplus(req, res) {
    try {
        let accounts = await Account.find({ excess:true })//.populate("department")
        if (!accounts || accounts.length <= 0) return res.status(404).send({ msg: "no accounts with shortage" })
        return res.send(accounts)
    }

    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}

export async function login(req, res) {
    let { email, password } = req.body

    try {
        let account = await Account.findOne({ email })
        if (!account) return res.status(404).send({ msg: "Email not found" })
        let isMatched = await bcrypt.compare(password, account.password)
        if (!isMatched) return res.status(400).send({ msg: "incorrect password" })

        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        res.status(200).send({ msg: "login succesful", company: account.company, name: account.name, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to login" }) }

}

export async function signup(req, res) {
    let { email, password, name } = req.body

    try {
        let old_account = await Account.findOne({ email })
        if (old_account) return res.status(400).send({ msg: "Email Already Exists" })

        let account = new Account({
            password,
            email,
            name,
            accountType: "admin",
            department: null,
            excess: false, // is the person hired or not
            skills: null,
            yearsOfExperience: null,
            positionTitle: null,
            passwordChanged: true,
            company: null

        })

        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        account.save().catch(err => console.log(err.message))
        res.status(200).send({ msg: "Signup sucessful", company: account.company, name: account.name, id: account._id, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to login" }) }
}

export async function createAccount(req, res) {

    let { email, password, name, positionTitle, accountType } = req.body

    try {
        let old_account = await Account.findOne({ email })
        if (old_account) return res.status(400).send({ msg: "Email Already Exists" })

        let account = new Account({
            password,
            email,
            name,
            accountType,
            department: null,
            excess: false, // is the person hired or not
            skills: null,
            yearsOfExperience: null,
            positionTitle,
            passwordChanged: false,
            company: companyId

        })

        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        account.save().catch(err => console.log(err.message))
        res.status(200).send({ msg: "Signup sucessful", company: account.company, name: account.name, id: account._id, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to login" }) }
}





export async function updateAccount(req, res) {
    let { yearsOfExperience, skills } = req.body
    let { id } = req.params

    try {

        let account = await Account.findByIdAndUpdate(id, { yearsOfExperience, skills }, { new: true })
        let { password, __v, ...rest } = account._doc
        return res.status(200).send(rest)

    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}
