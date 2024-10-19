import mongoose from "mongoose"

let positionSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        department: { ref: "department", type: mongoose.SchemaTypes.ObjectId },
        expectedSalary:Number,
        experienceYears:Number,
        requirments:[String],
        workingHours:Number,
        jobType:String,
        shift:String
    },

)
let Position = mongoose.model("position", positionSchema)
export default Position
//{ref:"User",type:mongoose.SchemaTypes.ObjectId}