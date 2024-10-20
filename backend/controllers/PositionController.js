import Position from "../models/Position.js"
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
        requirments, workingHours, jobType, shift, status } = req.body
    try {
        let position = new Position({
            title: title || "",
            description: description || "",
            department: department || "",
            expectedSalary: expectedSalary || "",
            experienceYears: experienceYears || "",
            requirments: requirments || "",
            workingHours: workingHours || "",
            jobType: jobType || "",
            shift: shift || "",
            status: status || "",
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