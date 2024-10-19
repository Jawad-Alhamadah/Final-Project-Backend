import jwt from "jsonwebtoken";
import Account from "../models/Account.js";
import Idea from "../models/Department.js";
export  function Admin_auth(req, res, next) {


     
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_secret, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
       

        let admin = await Account.findById(user.id)
        if(admin.userType!=="admin") return res.status(401).json({ message: 'Cant Access Unless you are an admin' });
      
        
        next()
    });

}





export function Student_auth(req, res, next) {

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_secret, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
       

        let student = await Account.findById(user.id).catch(err=>{return res.status(500).send(err.message)})

        let idea = await Idea.findById(req.params.id).catch(err=>{return res.status(500).send(err.message)})


        if (!idea) return res.status(404).send({message:"Project not found"})
        if (!student) return res.status(404).send({message:"Project Owner Not found"})

            
        if(student.userType==="admin") return  next()
        if(idea.studentId!=user.id ) return res.status(401).json({ message: 'Unauthorized Edit' });
       
        
        next()
    });

}




export function General_Auth(req, res, next) {

    
    
     
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_secret, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });

        next()
    });

}
