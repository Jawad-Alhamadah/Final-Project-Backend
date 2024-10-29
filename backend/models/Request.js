import mongoose from "mongoose"

let requestSchema = new mongoose.Schema(
    {

        employeeName: String,
        employeeId: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        oldPosition: String,
        newPosition: String,
        department: { ref: "department", type: mongoose.SchemaTypes.ObjectId },
        oldManager: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        newManager: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        isClosedByOldManager: Boolean,
        isClosedByNewManager: Boolean,
        isClosedByEmployee: Boolean,
        company: { ref: "company", type: mongoose.SchemaTypes.ObjectId },
        date: Date
    },

)
let Request = mongoose.model("request", requestSchema)
export default Request
//{ref:"User",type:mongoose.SchemaTypes.ObjectId}