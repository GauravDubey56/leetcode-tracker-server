import express from "express";
import { asyncHandler } from "./utils.js";
import {
  getAccessToken,
  verifyLogin,
  getUserInfo,
  searchQuestions,
  getSubmissions
} from "./controller.js";

const router = express();

router.get("/access-token", asyncHandler(getAccessToken));

router.post("/login", asyncHandler(verifyLogin));

router.post("/user-info", asyncHandler(getUserInfo));

router.post("/:questionSlug/submissions", asyncHandler(getSubmissions));

router.post("/searchSlug", asyncHandler(searchQuestions));

export default router;
