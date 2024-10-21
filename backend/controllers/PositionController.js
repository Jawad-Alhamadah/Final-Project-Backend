import Account from "../models/Account.js"
import Department from "../models/Department.js"
import Position from "../models/Position.js"
import Request from "../models/Request.js"

import  mongoose from 'mongoose';

export async function getPositionById(req, res) {
    try {
        let { id } = req.params
        let positions = await Position.findById(id)
        if (!positions) return res.status(404).send("position not found")
        return res.status(200).send(positions)
    }
    catch (err) { res.status(500).send({ msg: "Error getting record" }) }

}

export async function getAllPositions(req, res) {

    try {
        let positions = await Position.find()
        if (!positions) return res.status(404).send("no position found")
        res.status(200).send(positions)

    }
    catch (err) { res.status(500).send({ msg: "Error getting position" }) }
}

export async function postPosition(req, res) {
    let { title, description, department, expectedSalary, experienceYears,
        requirments, workingHours, jobType, shift } = req.body
    try {
        let position = new Position({
            title: title || "No Title",
            description: description || "No Description",
            department: department || "",
            expectedSalary: expectedSalary || 0,
            experienceYears: experienceYears || 0,
            requirments: requirments || [],
            workingHours: workingHours || 40,
            jobType: jobType || "on-site",
            shift: shift || "day",
            status: false,
        })
        await position.save()
        return res.status(200).send(position)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}

export async function updatePosition(req, res) {
    let { department, ...data } = req.body
    let { id } = req.params

    try {

        let position = await Position.findByIdAndUpdate(id, data, { new: true })
        return res.status(200).send(position)

    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}


export async function deletePosition(req, res) {
    let { id } = req.params

    try {

        let position = await Position.findByIdAndDelete(id)
        return res.status(200).send(position)

    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}






export async function fillPosition(req, res) {
    let companyId = req.query["company"]
    console.log(companyId)
    let { employeeId,positionId } = req.body


    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); 

    try {

        let position = await Position.findById(positionId).populate("department").session(session)
        if(!position) return res.status(404).send({msg:"position not found"})
        if(position.status) return res.status(400).send({msg:"position is already full"})

        let employee = await Account.findById(employeeId).populate("department").session(session)
        if(!employee) return res.status(404).send({msg:"Employee not found"})
        
        let oldDepartment = await Department.findById(employee.department._id).session(session)
        if(!oldDepartment) return res.status(404).send({msg:"Department not found"})
    
        

        let newDepartment = await Department.findById(position.department._id).session(session)
        if(!newDepartment) return res.status(404).send({msg:"Department not found"})

        
        let oldPosition = employee.positionTitle
        let oldManager = employee.department.manager

        let newPosition = position.title
        let newManager = position.department.manager
 
        
        employee.department = position.department._id
        employee.positionTitle = newPosition
        employee.excess=false
        await employee.save({session})

        newDepartment.employees.push(employee._id)
        newDepartment.employees = await [...new Set(newDepartment.employees)]
        oldDepartment.employees = await oldDepartment.employees.filter(e=>e.toString()!==employee._id.toString())
        oldDepartment.positions = await oldDepartment.positions.filter(p=>p.toString()!==position._id.toString())

        await newDepartment.save({session})
        await oldDepartment.save({session})
        let request = await new Request({

            employeeName: employee.name,
            oldPosition,
            newPosition,
            department:position.department._id,
            oldManager,
            newManager,
            company:companyId,
            date:Date.now()
        })
        await request.save({session})

        await session.commitTransaction();
        return res.status(200).send(request)

    }

    catch (err) {
        await session.abortTransaction()
        console.log(err.message); res.status(500).send({ msg: err.message })
    }
    finally{
        session.endSession()
    }

}

