import Department from "../models/Department.js";
import Account from "../models/Account.js";
import axios from "axios"
export async function getEmployeeSurplusByDepartment(req, res) {
    let { name } = req.params

    let department = await Department.findOne({ name });
    if (!department) return res.status(404).send({ msg: "Department Not Found" })

    let employees = await Account.find({ department, excess: true }).populate("department")

    if (!employees || employees.length <= 0) return res.send({ msg: ` No surplus employees in ${name}` })

    res.send(employees)
}


export async function getAllDepartments(req, res) {

    try {
        let departments = await Department.find()
        if (!departments) return res.status(404).send("no department found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }


}

export async function postDepartment(req, res) {
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
}


export async function getEmployeesByDepartmentName(req, res) {
    let { name } = req.params

    let department = await Department.findOne({ name });
    if (!department) return res.status(404).send({ msg: "Department Not Found" })

    let employees = await Account.find({ department }).populate("department")

    if (!employees) return res.send({ msg: `${name} has no employees` })

    res.send(employees)
}

export async function getDepartmentById(req, res) {
    try {
        let { id } = req.params
        let departments = await Department.findById(id)
        if (!departments) return res.status(404).send("department not found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting record" }) }

}

export async function getDepartmentsWithShortage(req, res) {

    try {
        let departments = await Department.find({ status: "shortage" }).populate("employees")
        if (!departments) return res.status(404).send("no department found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }

}

export async function getDepartmentsWithSurplus(req, res) {

    try {
        let departments = await Department.find({ status: "surplus" }).populate("employees")
        if (!departments) return res.status(404).send("no department found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }


}