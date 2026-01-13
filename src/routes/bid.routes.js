import { Router } from "express";
import { createBid,getBidsString, hireBid } from "../controller/bid.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router()

router.route("/").post(protect,createBid)
router.route("/:gigId").get(protect,getBidsString)
router.route("/:bidId/hire").patch(protect,hireBid)

export default router