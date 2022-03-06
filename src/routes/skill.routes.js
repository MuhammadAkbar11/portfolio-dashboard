import {
  deleteSkill,
  getSkills,
  postSkill,
  putSkill,
} from "../controllers/skill.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function SkillRoutes(app) {
  app
    .route("/skills")
    .get(ensureAuth, getSkills)
    .post(ensureAuth, postSkill)
    .put(ensureAuth, putSkill)
    .delete(ensureAuth, deleteSkill);
}

export default SkillRoutes;
