import express from "express";
import {
  getLabs,
  getLabBySlug,
} from "../controllers/labController.js";

const router = express.Router();

router.get("/", getLabs);
router.get("/:slug", getLabBySlug);

export default router;