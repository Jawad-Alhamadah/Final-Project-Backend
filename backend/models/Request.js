import mongoose from "mongoose"

let requestSchema = new mongoose.Schema(
    {
        // sender: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        // receiver: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        // senderStatus:String,
        // reciverStatus:String,
        // reqInitiator:String,
        // reqDate:Date
        employeeName: String,
        oldPosition:String,
        newPosition:String,
        department:{ ref: "department", type: mongoose.SchemaTypes.ObjectId },
        oldManager:{ ref: "account", type: mongoose.SchemaTypes.ObjectId },
        newManager:{ ref: "account", type: mongoose.SchemaTypes.ObjectId },
        company:{ ref: "company", type: mongoose.SchemaTypes.ObjectId },
        date:Date
    },

)
let Request = mongoose.model("request", requestSchema)
export default Request
//{ref:"User",type:mongoose.SchemaTypes.ObjectId}