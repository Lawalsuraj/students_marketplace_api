import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  UpdateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { verify, restrictTo } from "../middlewares/secure.js";

const router = express.Router();


router.post("/", verify, restrictTo("admin"), createUser);

router.get("/", verify, restrictTo("admin"), getUsers);

router.get("/:id", verify, restrictTo("admin"), getUser);

router.patch("/:id", verify, restrictTo("admin"), UpdateUser);

router.delete("/:id", verify, restrictTo("admin"), deleteUser);


export default router;