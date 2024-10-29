import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({

    skills: [String],
});

const Skills = mongoose.model("skill", skillsSchema);
export default Skills;


