import Account from "../models/Account.js"
import Department from "../models/Department.js"
import Position from "../models/Position.js"
import Request from "../models/Request.js"

import  mongoose from 'mongoose';

export async function getPositionById(req, res) {
    try {
        let { id } = req.params
        if(!id) return res.status(400).send({msg:"Id is empty"})
        let positions = await Position.findById(id).populate(
            {
                path: 'department',   
                populate: [{          
                    path: 'employees',
                    model: 'account'  
                },
                {          
                    path: 'positions',
                    model: 'position'  
                },
                {
                    path: 'manager',
                    model: 'account' 
                }
    
            ]
            }
        )
        if (!positions) return res.status(404).send("position not found")
        return res.status(200).send(positions)
    }
    catch (err) { console.log(err);res.status(500).send({ msg: "Error getting record" }) }

}

export async function getAllPositionsByDepartment(req, res) {
    let {id} = req.params
    try {
        let positions = await Position.find({department:id}).populate("department")
        if (!positions || positions.length<=0) return res.status(404).send("no position found")
        res.status(200).send(positions)

    }
    catch (err) { res.status(500).send({ msg: "Error getting position" }) }
}

export async function postPosition(req, res) {


    let session = await mongoose.startSession()
    session.startTransaction();

    let { title, description, department, expectedSalary, experienceYears,
        requirments, jobType,skills } = req.body

      //  console.log(jobType)
       
    try {
        let position = new Position({
            title: title || "No Title",
            description: description || "No Description",
            department: department || "",
            expectedSalary: expectedSalary || 0,
            experienceYears: experienceYears || 0,
            requirments: requirments || "",
            jobType: jobType || "on-site",
            status: false,
            skills
        })
        let new_position =  await position.save({session})
  
        let dep = await Department.findById(department).session(session)
        if(!dep){
           await session.abortTransaction()
            return res.status(404).send({msg:"Department not found"}) 
        }
    
        dep.positions.push(new_position._id)
        await dep.save({session})
        await session.commitTransaction()
        return res.status(200).send(position)
    }

    catch (err) {
       await session.abortTransaction()
        console.log(err.message); res.status(500).send({ msg: err.message })
    }
    finally{
        session.endSession()
    }

}

export async function updatePosition(req, res) {
    let { department, ...data } = req.body
    let { id } = req.params
    if(!id) return res.status(400).send({msg:"Id is empty"})

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
    if(!id) return res.status(400).send({msg:"Id is empty"})

    try {


        let position = await Position.findByIdAndDelete(id)
        let department = await Department.findbyId(position.department)
        let index_of_position =  department.positions.indexof(id)
        department.positions.splice(indexof(index_of_position),1)

        await department.save()
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
    console.log(employeeId +" , "+positionId)
    console.log("step1")
    if(!employeeId) return res.status(400).send({msg:"employee Id is empty"})
    if(!positionId) return res.status(400).send({msg:"positionId is empty"})
    console.log("step2")
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); 

    try {
        console.log("step3")
        let position = await Position.findById(positionId).populate("department").session(session)

        if(!position){ 
           await session.abortTransaction()
            return res.status(404).send({msg:"position not found"})
        }
        console.log("step4")
        if(position.status){ 
            await session.abortTransaction()
            return res.status(400).send({msg:"position is already full"})
        }
        console.log("step5")
        let employee = await Account.findById(employeeId).populate("department").session(session)
        if(!employee){ 
            await session.abortTransaction()
            return res.status(404).send({msg:"Employee not found"})
        }
        console.log("step6")
        let oldDepartment = await Department.findById(employee.department._id).session(session)
        if(!oldDepartment){
            await session.abortTransaction()
             return res.status(404).send({msg:"Department not found"}) 
            }
    
        
        console.log("step7")
        let newDepartment = await Department.findById(position.department._id).session(session)
        if(!newDepartment){
          await  session.abortTransaction()
            return res.status(404).send({msg:"Department not found"})
        }

        console.log("step8")
        let oldPosition = employee.positionTitle
        let oldManager = employee.department.manager

        console.log("step9")
        let newPosition = position.title
        let newManager = position.department.manager
 
        
        console.log("step10")
        employee.department = position.department._id
        employee.positionTitle = newPosition
        employee.excess=false
        await employee.save({session})

        console.log("step11")
        newDepartment.employees.push(employee._id)
        console.log("step12")
        newDepartment.employees = await [...new Set(newDepartment.employees)]
        console.log("step13")
        oldDepartment.employees = await oldDepartment.employees.filter(e=>e.toString()!==employee._id.toString())
        console.log("step14")
        oldDepartment.positions = await oldDepartment.positions.filter(p=>p.toString()!==position._id.toString())
        console.log("step15")
        oldDepartment.surplusCount =  oldDepartment.surplusCount -1

        oldDepartment.empNum = oldDepartment.employees.length
        newDepartment.empNum = newDepartment.employees.length

        position.status=true ;
    
        console.log("step16")
        await newDepartment.save({session})
        await oldDepartment.save({session})
        await position.save({session})
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
        console.log("step17")
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

