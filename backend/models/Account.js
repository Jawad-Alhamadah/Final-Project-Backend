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

`
 I will give you Multiple Schemas of Data and i want you to generate sensable mock data from it using MongoDB.
 each table will have a key linking it to another row of another table so you must make sure the data,
 created is linked.

prerequest: this skill array will be refered to below. Keep it in mind:
"skills":["Communication","Leadership","Project Management","Problem-Solving","Negotiation","Time Management","Financial Analysis","Marketing","Strategic Thinking","Customer Service","Sales","Data Analysis","Decision-Making","Adaptability","Financial Management","Collaboration","Risk Management","Entrepreneurship","Emotional Intelligence","Change Management","Networking","Conflict Resolution","Innovation","Public Speaking","Organizational Skills","Critical Thinking","Business Acumen","Customer Relationship Management (CRM)","Supply Chain Management"]

1. create accounts Using MongoDB Id (ObjectId) 
Shcema : 

 name: String,
 email: String,
 password: "",
 accountType: {string of admin , manager , or employee  goes here},
 department: {department id Goes here},
 excess: Boolean,
 skills: [String],
 yearsOfExperience: Number,
 positionTitle: String,
 passwordChanged: Boolean,
 aboutMe: String,
 education: String,

 company: {id of company goes here}
 });
``
create atleast 20, only 1 Admin

2. create a single company. tie its ID back to the Admin Account
// const companySchema = new mongoose.Schema({

//     name:String,
//     admin:{admin ID goes here}
// });

2.create 6 departments.
:schema:  

  {
        name:String,
        empNum: Number,
        manager: {id of an account with "accountType=manager" goes here},
        employees: [{list the IDs of few accounts with "accountType=employee}],
        positions: [{a few Ids of the Positions schema}],
        surplusCount:Number,
        company:{ Same ID of company as earlier }
        
    },

3.create 20 positions. spread them around each department and make sure each position has a description that 
represents its Department name.

schema:
 {
        title: String,
        description: String,
        department: { Id of a department here },
        expectedSalary:Number,
        experienceYears:Number,
        requirments:String,
        jobType: {string that could be on-site, remote,mixed},
        skills:[{pick 3 to 7 from the skills from array provided above.}],
        status:Boolean,
        company:{ same company ID}
    },


