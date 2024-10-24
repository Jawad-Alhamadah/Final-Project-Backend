import mongoose from "mongoose"

let positionSchema = new mongoose.Schema(
    {
        title: {
            type:String,
            required:[true,"You must provide a title"]
        },
        description: String,
        department: { ref: "department", type: mongoose.SchemaTypes.ObjectId },
        expectedSalary:Number,
        experienceYears:Number,
        requirments:String,
        jobType:String,
        status:Boolean,
        company:{ ref: "company", type: mongoose.SchemaTypes.ObjectId }
    },

)
let Position = mongoose.model("position", positionSchema)
export default Position
//{ref:"User",type:mongoose.SchemaTypes.ObjectId}