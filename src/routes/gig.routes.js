import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createGig,getMyGigs,getOpenGigs } from "../controller/gig.controller.js";
const router = Router()

router.route("/").post(protect,createGig)
router.route("/").get(protect,getOpenGigs)
router.route("/my").get(protect,getMyGigs)
export default router