import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import router from "./router/router.js"
import cors from "cors"
import skillsRouter from "./router/SkillsRouter.js"
import departmentRouter from "./router/DepartmentRouter.js"
import positionRouter from "./router/PositionRouter.js"
import requestRouter from "./router/RequestRouter.js"
import accountRouter from "./router/AccountRouter.js"
import chatRouter from "./router/ChatRouter.js"

dotenv.config()

startConnection().catch(err => console.log(err))
async function startConnection() {
    await mongoose.connect(process.env.CONNECTION_STRING)

    console.log("connected to Mongoose")
}

let port = process.env.BACKEND_PORT
const app = express()
app.use(express.json())
app.use(cors())

app.use(router)
app.use("/skills", skillsRouter)
app.use("/department", departmentRouter)
app.use("/position", positionRouter)
app.use("/request", requestRouter)
app.use("/account", accountRouter)
app.use("/chat", chatRouter)

app.listen(port || 7000, () => console.log(`listening to ${port || 7000}`))
