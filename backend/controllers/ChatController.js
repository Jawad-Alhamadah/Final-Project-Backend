import Position from "../models/Position.js"
import OpenAI from "openai";
import dotenv from 'dotenv'
import Account from "../models/Account.js";
dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export async function recommendEmployees (req, res) {
    //gpt-4o
    let { id } = req.params //id Of Position
   
    let position = await Position.findById(id)
    if (!position) return res.status(404).send({ msg: "Position not Found" })
    
    let employees = await Account.find({ accountType: "employee", excess: true ,department:{$ne:position.department.toString()}}).populate("department")
    if (!employees || employees.length<=0) return res.status(404).send({ msg: "no surplus employees found" })
      
    let filtered = await employees.map(({ _doc }) => {

        let obj = {
            yearOfEXP: _doc.yearsOfExperience,
            currentJob: _doc.positionTitle,
            id: _doc._id,
            skills: _doc.skills,
            name: _doc.name,


        }
            return obj
    })
   
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.3,
            messages: [
                { role: "system", content: "you are a seasoned recruiter with 20 years of experience and a successful track record as a headhunter. Your task is to review a list of employees and order them for suitability" },
                {
                    role: "user",
                    content: `Instructions: Select the most suitable employees for the position described below, ranking them in descending order of suitability.

Your response should include only employee IDs, separated by commas with NO spaces.

                Employees : 
                ${JSON.stringify(filtered)}
Position : "
position title: ${position.title}
Department: ${position.department.name}
Experience: ${position.experienceYears}
Estimated : ${position.expectedSalary}
Description : 
${position.description}"

`,
                },
            ],
        });

        let recommendations = completion.choices[0].message.content.split(",")
        let first_recommendation = await Account.findById(recommendations[0])
        let second_recommendation = await Account.findById(recommendations[1])
        let third_recommendation = await Account.findById(recommendations[2])

        return res.status(200).send([first_recommendation, second_recommendation, third_recommendation])
    }
    catch (err) { console.log(err); res.status(500).send({ msg: "Error promphting chat GBT" }) }

}