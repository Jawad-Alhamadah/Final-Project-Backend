import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({

    name: String,
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "You must provide an email"],
        validate: [
            {
                validator: (email) => {
                    return String(email).toLowerCase().match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
                },
                message: "Not a valid email"
            }
        ]
    },
    password: String,
    accountType: String,
    department: { ref: "department", type: mongoose.SchemaTypes.ObjectId },
    excess: Boolean, // is the person hired or not
    skills: [String],
    yearsOfExperience: Number,
    positionTitle: String,
    passwordChanged: Boolean,
    aboutMe: String,
    description: String,

    company: { ref: "company", type: mongoose.SchemaTypes.ObjectId }
});

const Account = mongoose.model("account", AccountSchema);
export default Account;


