import {
  deleteSkill,
  postSkill,
  putSkill,
} from "../controllers/skill.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function SkillRoutes(app) {
  app
    .route("/skills")
    .post(ensureAuth, postSkill)
    .put(ensureAuth, putSkill)
    .delete(ensureAuth, deleteSkill);
}

export default SkillRoutes;
