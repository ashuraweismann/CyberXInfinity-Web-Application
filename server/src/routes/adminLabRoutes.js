
import express from "express";

import {
  getAdminLabs,
  getAdminLabById,
  createLab,
  updateLab,
  deleteLab,
} from "../controllers/adminLabController.js";

const router = express.Router();

router.route("/")
  .get(getAdminLabs)
  .post(createLab);

router.route("/:id")
  .get(getAdminLabById)
  .put(updateLab)
  .delete(deleteLab);

export default router;
