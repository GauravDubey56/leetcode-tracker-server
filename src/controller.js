import { LeetcodeAuth } from "./leetcodeAuth.js"
import { Questions } from "./questions.js";
import { sendResponse } from "./utils.js";

const leetcodeAuth = new LeetcodeAuth();
const questions = new Questions();


export const getAccessToken = async (req, res) => {
    const token = await leetcodeAuth.accessToken();
    sendResponse(res, {data: token, status: 200, message: "Success"});
}

export const verifyLogin = async (req, res) => {
    const d = req.body;
    const data = await leetcodeAuth.verifyLogin(d.token, d.session);
    sendResponse(res, {data, status: 200, message: "Success"});
}

export const getUserInfo = async (req, res) => {
    const d = req.body;
    const data = await leetcodeAuth.getUserInfo(d.username, d.token, d.session);
    sendResponse(res, {data, status: 200, message: "Success"});
}

export const getSubmissions = async (req, res) => {
    const data = await questions.getSubmissions(req.body.token, req.body.session, req.params.questionSlug);
    sendResponse(res, {data, status: 200, message: "Success"});
}

export const searchQuestions = async (req, res) => {
    const data = await questions.searchQuestions(req.body.token, req.body.session, req.query);
    sendResponse(res, {data, status: 200, message: "Success"});
}
