import Skills from "../models/Skills.js";

export async function getSkills(req, res) {

    let skills = await Skills.findOne()
    res.status(200).send(skills)
}


export async function postSkills(req, res) {
    const skills = [
        "Communication",
        "Leadership",
        "Project Management",
        "Problem-Solving",
        "Negotiation",
        "Time Management",
        "Financial Analysis",
        "Marketing",
        "Strategic Thinking",
        "Customer Service",
        "Sales",
        "Data Analysis",
        "Decision-Making",
        "Adaptability",
        "Financial Management",
        "Collaboration",
        "Risk Management",
        "Entrepreneurship",
        "Emotional Intelligence",
        "Change Management",
        "Networking",
        "Conflict Resolution",
        "Innovation",
        "Public Speaking",
        "Organizational Skills",
        "Critical Thinking",
        "Business Acumen",
        "Customer Relationship Management (CRM)",
        "Supply Chain Management"
    ];

    let sk = new Skills({
        skills
    })

    await sk.save()
    res.send(sk)
}