import Skills from "../models/Skills.js";

export  async function getSkills(req,res){
    
    let skills = await Skills.findOne()
    res.status(200).send(skills)
}