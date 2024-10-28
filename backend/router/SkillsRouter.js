import { getSkills, postSkills } from "../controllers/SkillsController.js"
import { Router } from "express";

const router = Router()

//  /skills
router.get("", getSkills)

router.post("", postSkills)

export default router