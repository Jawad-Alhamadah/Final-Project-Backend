


import Account from "../models/Account.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function getAccountById (req, res){
    try {
        let { id } = req.params
        let accounts = await Account.findById(id).populate("department")
        if (!accounts) return res.status(404).send("account not found")
        let { name, accountType, excess, department } = accounts
        return res.status(200).send({ name, accountType, excess, department })
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}

export async function getAllAccounts (req, res) {
    let accounts = await Account.find().populate("department")
    res.send(accounts)
}

export async function login (req, res)  {
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

}

export async function signup (req, res) {
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

}