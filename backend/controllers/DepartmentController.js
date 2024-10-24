import Department from "../models/Department.js";
import Account from "../models/Account.js";

import  mongoose from 'mongoose';


export async function getEmployeeSurplusByDepartment(req, res) {
    let { name } = req.params

    let department = await Department.findOne({ name });
    if (!department) return res.status(404).send({ msg: "Department Not Found" })

    let employees = await Account.find({ department: department._id, excess: true }).populate("department")

    if (!employees || employees.length <= 0) return res.status(404).send({ msg: ` No surplus employees in ${name}` })

    return res.status(200).send(employees)
}


export async function getAllDepartments(req, res) {
    let companyId = req.query["company"]
    if (!companyId) return res.status(404).send({ msg: "Company Not Found" })
    console.log(companyId)
    try {
        let departments = await Department.find({ company: companyId }).populate("manager").populate("positions")
        
        if (!departments || departments.length <= 0) return res.status(404).send({ msg: "no department found" })
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting department" }) }


}


export async function postDepartment(req, res) {
    let { name, manager } = req.body
    let companyId = req.query["company"]

    let session = await mongoose.startSession()
    session.startTransaction();
    
    try {


        let check_department = await Department.findOne({ name }).session(session)

        if (check_department) {
            await session.abortTransaction()
            return res.status(400).send({ msg: "department already exists" })
        }

        let check_manager = await Account.findById(manager).session(session)
        if (!check_manager){
            await session.abortTransaction()
            return res.status(400).send({ msg: "account not found" })
        } 
       
        if(check_manager.accountType!=="manager"){
            await session.abortTransaction()
            return res.status(400).send({ msg: "Account is not a manager" })
        }
        if (check_manager.department){
            await session.abortTransaction()
            return res.status(400).send({ msg: "Already a manager of a different department" })
        } 

        let new_department = await new Department({
            name,
            empNum: 1,
            manager,
            employees: [check_manager._id],
            neededEmployees: [],
            positions: [],
            company: companyId,
            surplusCount:0
        })

        check_manager.department = new_department._id

        await new_department.save({session})
        await check_manager.save({session})
        await session.commitTransaction()

        return res.status(200).send(new_department)

    }
    catch (err) { 
        await session.abortTransaction()
        return res.status(500).send({ msg: "error creating department" }) 
    }
    finally{
        session.endSession()
    }




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
        let departments = await Department.findById(id).populate(["manager","employees"])


        if (!departments) return res.status(404).send("department not found")
        res.status(200).send(departments)
    }
    catch (err) { res.status(500).send({ msg: "Error getting record" }) }

}

// export async function getDepartmentsWithShortage(req, res) {

//     try {
//         let departments = await Department.find({ status: "shortage" }).populate("employees")
//         if (!departments) return res.status(404).send("no department found")
//         res.status(200).send(departments)
//     }
//     catch (err) { res.status(500).send({ msg: "Error getting department" }) }

// }

// export async function getDepartmentsWithSurplus(req, res) {

//     try {
//         let departments = await Department.find({ status: "surplus" }).populate("employees")
//         if (!departments) return res.status(404).send("no department found")
//         res.status(200).send(departments)
//     }
//     catch (err) { res.status(500).send({ msg: "Error getting department" }) }


// }

export async function getDepartmentShortage(req, res) {
    let companyId = req.query["company"]
    if (!companyId) return res.status(404).send({ msg: "Company Not Found" })

    try {

        let shortage_departments = await Department.find({
            positions: { $not: { $size: 0 } },
            company: companyId
        })

        if (!shortage_departments || shortage_departments.length <= 0) return res.status(404).send({ msg: "no departments with shortage" })
        return res.send(shortage_departments)
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}


export async function getDepartmentSurplus(req, res) {
    let companyId = req.query["company"]
    if (!companyId) return res.status(404).send({ msg: "Company Not Found" })

    try {

        let surplus_departments = await Department.aggregate([
            {
                $lookup: {
                    from: "accounts", // Schema you are linking to
                    localField: "employees", // its name in the Department schema (or locally)
                    foreignField: "_id", //the Key that ties the two Schemas
                    as: "employees" // The Name you want to give the resutling population
                }
            },
            {
                $match: {
                    "employees.excess": true, // filter
                }
            }
        ]);

        let filteredByCompany = await surplus_departments.filter(d => d.company.toString() === companyId)

        if (!filteredByCompany || filteredByCompany.length <= 0) return res.status(404).send({ msg: "no departments with surplus" })
        return res.send(filteredByCompany)
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error getting record" }) }

}


