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
                { role: "system", content: "You are a recruiter with 20 years experience, head hunter with good experience in finding good employees  . You will be given a number of Employees and you'll pick the most suitable" },
                {
                    role: "user",
                    content: `pick the employees most fit based on the position in the qoutes below                      
                 your content should only contain 3 ID of the most fit employees seperated by a comma, NO spaces
                 you must return atleast one employee ID as a recommendation.

                Employees : 
                ${JSON.stringify(filtered)}
Position : "
position title: ${position.title}
Department: ${position.department.name}
Experience: ${position.experienceYears}
Estimated : ${position.expectedSalary}
Description : 
${position.description}"

i'll reitirate, you must return atleast one employee ID as a recommendation.

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