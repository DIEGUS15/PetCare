import { Router } from "express";
import {
  register,
  login,
  logout,
  getUsers,
  deleteUser,
  updateUser,
  profile,
  verifyToken,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post(
  "/register",
  authRequired,
  checkRole(["admin"]),
  validateSchema(registerSchema),
  register
);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/user", authRequired, checkRole(["admin"]), getUsers);
router.delete("/user/:id", authRequired, checkRole(["admin"]), deleteUser);
router.put("/user/:id", authRequired, checkRole(["admin"]), updateUser);
router.get("/user/profile", authRequired, profile);
router.get("/verify", verifyToken);

export default router;
