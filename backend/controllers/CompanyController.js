import Company from "../models/Company.js"
import Account from "../models/Account.js"
import Position from "../models/Position.js"
import Request from "../models/Request.js"
export async function createCompany(req, res) {
    let { name, admin } = req.body
    try {
        let company = new Company({ name, admin })
        await company.save()

        let account = await Account.findById(admin)
        if(!account)  return res.status(404).send({ msg: "admin not found" })
        account.company = company.id
        await account.save()
        return res.send(company)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}


export async function getAllPositionsByCompany(req, res) {
    let { id } = req.params
    console.log(id)
    try {
    
        let positions = await Position.find({company:id})
        if(!positions)  return res.status(404).send({ msg: "no positions found" })
        return res.send(positions)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}


export async function getAllNotificationsByCompany(req, res) {
    let { id } = req.params
    try {
    
        let notification = await Request.find({company:id})
        if(!notification)  return res.status(404).send({ msg: "no notifications found" })
            
        return res.send(notification)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}