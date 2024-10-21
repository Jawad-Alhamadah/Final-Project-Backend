import Company from "../models/Company.js"
import Account from "../models/Account.js"
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