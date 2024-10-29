import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    name: String,
    admin: { ref: "account", type: mongoose.SchemaTypes.ObjectId }
});

const Company = mongoose.model("company", companySchema);
export default Company;


