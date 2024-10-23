import jwt from "jsonwebtoken";
import Account from "../models/Account.js";
import { ObjectId } from "mongoose"
export function Admin_auth(req, res, next) {

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied: Lack of Authorization' });

    jwt.verify(token, process.env.JWT_secret, async (err, account) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });


        let admin = await Account.findById(account.id)
        if (admin.accountType !== "admin") return res.status(403).json({ message: 'Need admin permission for this action' });
        next()
    });

}


export function Employee_auth(req, res, next) {

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied: Lack of Authorization' });

    jwt.verify(token, process.env.JWT_secret, async (err, account) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });
        console.log(req.params.id)
        console.log(account.id)
        if (account.id !== req.params.id) return res.status(403).json({ message: 'Access denied' })
        next()
    });

}


export function verify_department(req,res,next){
    let {department} = req.body
    if(!department) return res.status(404).send("no department found")
    
    let isAuthorized = department === req.user.department.toString()
    if(!isAuthorized) return res.status(404).send({msg:"Unauthorized: Can't edit different departments"})
    
    next()
  
}

export function Manager_auth(req, res, next) {
    let companyId = req.query["company"]
    if (!companyId) return res.status(404).json({ error: 'Company Not found' });

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied: Lack of Authorization' });

    jwt.verify(token, process.env.JWT_secret, async (err, account) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });

        let new_account = await Account.findById(account.id)
        if (!new_account) return res.status(401).json({ message: 'access denied' });

        if (new_account.company.toString() !== companyId) return res.status(401).json({ message: 'Cant access Company' });

        let isAuthorized = new_account.accountType === "manager" 
        if (!isAuthorized) return res.status(401).json({ message: 'Access denied, Must be a manager' });

        req.user = new_account
        next()
    });

}

export function company_auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied: Lack of Authorization' });

    let companyId = req.query["company"]
    if (!companyId) return res.status(404).send({ msg: "Company Not Found" })
    jwt.verify(token, process.env.JWT_secret, async (err, account) => {

        if (err) return res.status(401).json({ message: 'Invalid Token' });

        let new_account = await Account.findById(account.id)
        if (!new_account) return res.status(401).json({ message: 'access denied' });

        if (new_account.company.toString() !== req.query["company"]) return res.status(401).json({ message: 'access denied' });

        // let isAuthorized = new_account.company.toString() === companyId
        // if (!isAuthorized) return res.status(401).json({ message: 'access denied' });

        next()
    });
}

// export function Student_auth(req, res, next) {

//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ error: 'Access denied' });

//     jwt.verify(token, process.env.JWT_secret, async (err, user) => {
//         if (err) return res.status(403).json({ message: 'Invalid Token' });


//         let student = await Account.findById(user.id).catch(err=>{return res.status(500).send(err.message)})

//         let idea = await Idea.findById(req.params.id).catch(err=>{return res.status(500).send(err.message)})


//         if (!idea) return res.status(404).send({message:"Project not found"})
//         if (!student) return res.status(404).send({message:"Project Owner Not found"})


//         if(student.userType==="admin") return  next()
//         if(idea.studentId!=user.id ) return res.status(401).json({ message: 'Unauthorized Edit' });


//         next()
//     });

// }

export function General_Auth(req, res, next) {

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_secret, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });

        next()
    });

}
