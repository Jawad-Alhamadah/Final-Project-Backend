import Account from "../models/Account.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Company from "../models/Company.js";

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
    try {
        let companyId = req.query["company"]

        let accounts = await Account.find({ company: companyId })//.populate("department")
        let data = accounts.map(e => {
            let { password, __v, ...accounts } = e._doc
            return accounts
        })
        //
        res.send(data)
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}

export async function getAccountSurplus(req, res) {
    try {
        let accounts = await Account.find({ excess: true })//.populate("department")
        if (!accounts || accounts.length <= 0) return res.status(404).send({ msg: "no accounts with shortage" })
        return res.send(accounts)
    }

    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}

export async function login(req, res) {
    let { email, password } = req.body

    try {
        let account = await Account.findOne({ email }).populate("department")
        if (!account) return res.status(404).send({ msg: "Email not found" })
        let isMatched = await bcrypt.compare(password, account.password)
        if (!isMatched) return res.status(400).send({ msg: "incorrect password" })

        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        res.status(200).send({ msg: "login succesful", id: account.id, accountType:account.accountType, department: account.department, company: account.company, name: account.name, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to login" }) }

}

export async function signup(req, res) {
    let { email, password, name, company } = req.body

    try {
        let old_account = await Account.findOne({ email })
        if (old_account) return res.status(400).send({ msg: "Email Already Exists" })

        let account = await new Account({
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

              
        let new_company = await new Company({
            name: company,
            admin: account._id

        })

        account.company  = new_company._id
        await account.save()
        await new_company.save()
        let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        res.status(200).send({ msg: "Signup sucessful", company: new_company, name: account.name, id: account._id, token: token, excess: account.excess })
    }
    catch (err) { res.status(500).send({ msg: "Error while trying to signup" }) }
}

export async function createAccount(req, res) {
    let companyId = req.query["company"]
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

        //let token = await jwt.sign({ id: account._id, email: account.email }, process.env.JWT_secret, { expiresIn: "2h" })
        await account.save()
        res.status(200).send({ msg: "Account Created Sucessfully",accountType:account.accountType,email:account.email, company: account.company, name: account.name, id: account._id, excess: account.excess })
    }
    catch (err) {console.log(err) ;res.status(500).send({ msg: "Error while trying to create Account" }) }
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


export async function updateAccountSkills(req, res) {
    let { skill } = req.body
    let { id } = req.params

    try {

        let account = await Account.findById(id)
        if (!account) return res.status(404).send({ msg: "account not found" })

        account.skills.push(skill)
        account.skills = [...new Set(account.skills)]
        await account.save()
        let { password, __v, ...rest } = account._doc
        return res.status(200).send(rest)

    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}




export async function deleteAccountSkills(req, res) {
    let { skill } = req.body
    let { id } = req.params

    try {

        let account = await Account.findById(id)
        if (!account) return res.status(404).send({ msg: "account not found" })

        let filtered = await account.skills.filter(s => s !== skill)
        account.skills = filtered
        await account.save()
        let { password, __v, ...rest } = account._doc
        return res.status(200).send(rest)

    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}
