import mongoose from "mongoose"

let requestSchema = new mongoose.Schema(
    {
        sender: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        receiver: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        senderStatus:String,
        reciverStatus:String,
        reqInitiator:String,
        reqDate:Date
    },

)
let Request = mongoose.model("request", requestSchema)
export default Request
//{ref:"User",type:mongoose.SchemaTypes.ObjectId}