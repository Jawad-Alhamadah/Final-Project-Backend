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
    education: String,

    company: { ref: "company", type: mongoose.SchemaTypes.ObjectId }
});

const Account = mongoose.model("account", AccountSchema);
export default Account;

// `
//  I will give you Multiple Schemas of Data and i want you to generate sensable mock data from it using MongoDB.
//  each table will have a key linking it to another row of another table so you must make sure the data,
//  created is linked.

// 1. create accounts Using MongoDB Id (ObjectId) 
// Shcema : 

//  name: String,
//  email: String,
//  password: "",
//  accountType: {admin , manager , or Employee },
//  department: {department id Goes here},
//  excess: Boolean,
//  skills: [String],
//  yearsOfExperience: Number,
//  positionTitle: String,
//  passwordChanged: Boolean,
//  aboutMe: String,
//  education: String,

//  company: { ref: "company", type: mongoose.SchemaTypes.ObjectId }
//  });
// ``
// create atleast 20, only 1 Admin

// 2. create a single company. tie its ID back to the Admin Account
// // const companySchema = new mongoose.Schema({

// //     name:String,
// //     admin:{admin ID goes here}
// // });

// 2.create 6 departments.
// :schema:  

//   {
//         name:String,
//         empNum: Number,
//         manager: {id of an account with "accountType=manager" goes here},
//         employees: [{list the IDs of few accounts with "accountType=employee}],
//         neededEmployees:[String],
//         positions: [{ ref: "position", type: mongoose.SchemaTypes.ObjectId }],
//         surplusCount:Number,
//         company:{ ref: "company", type: mongoose.SchemaTypes.ObjectId }
        
//     },



