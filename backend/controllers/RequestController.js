import Request from "../models/Request.js"
export async function getAllRequests(req, res) {
    try {
        let requests = await Request.find()
        if (!requests) return res.status(404).send("no position request found")
        res.status(200).send(requests)
    }
    catch (err) { console.log(err.message); res.status(500).send({ msg: "Error getting notification request" }) }

}

export async function getRequestById(req, res) {
    try {
        let { id } = req.params
        if (!id) return res.status(400).send({ msg: "Id is empty" })

        let requests = await Request.findById(id)
        if (!requests) return res.status(404).send("position request not found")
        return res.status(200).send(requests)
    }
    catch (err) { console.log(err.message); res.status(500).send({ msg: "Error getting record" }) }

}


export async function postRequest(req, res) {
    let { sender, receiver, senderStatus, reciverStatus, reqInitiator } = req.body
    try {
        let request = new Request({
            sender: sender || "",
            receiver: receiver || "",
            senderStatus: senderStatus || "",
            reciverStatus: reciverStatus || "",
            reqInitiator: reqInitiator || "",
            reqDate: Date.now()
        })
        await request.save()
        return res.status(200).send(request)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }
}



export async function getRequestByAccountIdSender(req, res) {
    let { id } = req.params
    if (!id) return res.status(400).send({ msg: "Id is empty" })

    try {

        let request = Request.find({ sender: id })
        if (!request) return res.status(404).send({ msg: "no Request found" })
        return res.status(200).send(request)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }
}

export async function getRequestByAccountIdReceiver(req, res) {
    let { id } = req.params
    if (!id) return res.status(400).send({ msg: "Id is empty" })

    try {

        let request = Request.find({ receiver: id })
        if (!request) return res.status(404).send({ msg: "no Request found" })
        return res.status(200).send(request)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }
}


export async function updateRequest(req, res) {

    let { id } = req.params
    let { accountId } = req.body
    if (!id) return res.status(400).send({ msg: "Id is empty" })
    try {

        let request = await Request.findById(id)
        if (!request) return res.status(404).send({ msg: "notification not found" })
        if (accountId === request.oldManager.toString()) request.isClosedByOldManager = true
        if (accountId === request.newManager.toString()) request.isClosedByNewManager = true
        if (accountId === request.employeeId.toString()) request.isClosedByEmployee = true

        await request.save()

        return res.status(200).send(request)
    }
    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}


export async function deleteRequest(req, res) {
    let { id } = req.params
    if (!id) return res.status(400).send({ msg: "Id is empty" })

    try {

        let request = await Request.findByIdAndDelete(id)
        return res.status(200).send(request)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}



export async function getNotifications(req, res) {
    let { id } = req.params
    if (!id) return res.status(400).send({ msg: "Id is empty" })

    try {

        let employees = await Request.find({ employeeId: id })
        let oldManager = await Request.find({ oldManager: id })
        let newManager = await Request.find({ newManager: id })
        let notifications = {
            employees,
            oldManager,
            newManager
        }
        return res.status(200).send(notifications)
    }

    catch (err) {
        console.log(err.message); res.status(500).send({ msg: err.message })
    }

}