import mongoose from "mongoose"

let departmentSchema = new mongoose.Schema(
    {
       

        name:{
            type:String,
            unique: [true, "Department already exists"]
        },
        empNum: Number,
        status: String,
        manager: { ref: "account", type: mongoose.SchemaTypes.ObjectId },
        employees: [{ ref: "account", type: mongoose.SchemaTypes.ObjectId }],
        limit:Number,
        neededEmployees:[String],
        positions: [{ ref: "position", type: mongoose.SchemaTypes.ObjectId }],

    },

)
let Department = mongoose.model("department", departmentSchema)
export default Department
//{ref:"User",type:mongoose.SchemaTypes.ObjectId}


