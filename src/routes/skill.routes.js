import {
  deleteSkill,
  getSkills,
  postSkill,
  putSkill,
} from "../controllers/skill.controller.js";
import { ensureAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { skillSchema } from "../validators/index.js";

function SkillRoutes(app) {
  app
    .route("/skills")
    .get(ensureAuth, getSkills)
    .post(ensureAuth, validateRequest(skillSchema), postSkill)
    .put(ensureAuth, validateRequest(skillSchema), putSkill)
    .delete(ensureAuth, deleteSkill);
}

export default SkillRoutes;
