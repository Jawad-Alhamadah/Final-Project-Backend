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
    catch (err) {   console.log(err.message);res.status(500).send({ msg: "Error getting position" }) }
}

export async function postPosition(req, res) {
    let companyId = req.query["company"]

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
            skills,
            company:companyId
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
        let department = await Department.findById(position.department)

        let index_of_position =  department.positions.indexOf(id)
        department.positions.splice(index_of_position,1)

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

    if(!employeeId) return res.status(400).send({msg:"employee Id is empty"})
    if(!positionId) return res.status(400).send({msg:"positionId is empty"})

    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); 

    try {

        let position = await Position.findById(positionId).populate("department").session(session)
       

        if(!position){ 
           await session.abortTransaction()
            return res.status(404).send({msg:"position not found"})
        }

        if(position.status){ 
            await session.abortTransaction()
            return res.status(400).send({msg:"position is already full"})
        }

        let employee = await Account.findById(employeeId).populate("department").session(session)
        if(!employee){ 
            await session.abortTransaction()
            return res.status(404).send({msg:"Employee not found"})
        }
        console.log("department Id :  "+ employee.department._id)
        console.log("Employee Id:  "+ employeeId)
        console.log("position Id:  "+ positionId)
        let oldDepartment = await Department.findById(employee.department._id).session(session)
        if(!oldDepartment){
            await session.abortTransaction()
             return res.status(404).send({msg:"Department not found"}) 
            }
    
        
            
        console.log("here 1")
        let newDepartment = await Department.findById(position.department._id).session(session)
        if(!newDepartment){
          await  session.abortTransaction()
            return res.status(404).send({msg:"Department not found"})
        }

        console.log("here 2")

        let oldPosition = employee.positionTitle
        let oldManager = employee.department.manager

        let newPosition = position.title
        let newManager = position.department.manager
 
        
        console.log("here 3")

        employee.department = position.department._id
        employee.positionTitle = newPosition
        employee.excess=false
        await employee.save({session})

        console.log("here 4")

        console.log(oldDepartment)
        newDepartment.employees.push(employee._id)
        newDepartment.employees = await [...new Set(newDepartment.employees)]
        oldDepartment.employees = await oldDepartment.employees.filter(e=>e.toString()!==employee._id.toString())
        //oldDepartment.positions = await oldDepartment.positions.filter(p=>p.toString()!==position._id.toString())
        newDepartment.positions = await newDepartment.positions.filter(p=>p.toString()!==position._id.toString())
        oldDepartment.surplusCount =  oldDepartment.surplusCount -1
        
        oldDepartment.empNum = oldDepartment.employees.length
        newDepartment.empNum = newDepartment.employees.length


        console.log("here 5")

        position.status=true ;
    
        await newDepartment.save({session})
        console.log(oldDepartment)
        console.log("here 6")
        await oldDepartment.save({session})
        console.log("here 7")
        await position.save({session})
        console.log("here 8")
        

        let request = await new Request({

            employeeName: employee.name,
            oldPosition,
            newPosition,
            department:position.department._id,
            oldManager,
            newManager,
            company:companyId,
            isClosedByOldManager:false,
            isClosedByNewManager:false,
            isClosedByEmployee:false,
            employeeId:employee._id,
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

