import Express from "express";
import Cors from "cors";
import { LeetcodeAuth } from "./leetcodeAuth.js";
import { Questions } from "./questions.js";

const app = Express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(Cors(corsOptions));

app.use(
  Express.urlencoded({
    extended: true,
  })
);

app.use(Express.json());

const leetcodeAuth = new LeetcodeAuth();

app.get("/", (req, res) => {
  res.send("Leetcode Question Tracker");
});

app.get("/access-token", async (req, res) => {
  const token = await leetcodeAuth.accessToken();
  res.json(token);
});

app.post("/login", async (req, res) => {
  const d = req.body;
  const resp = await leetcodeAuth.verifyLogin(d.token, d.session);
  res.json(resp.data["userStatus"]);
});

app.post("/user-info", async (req, res) => {
  const d = req.body;
  const data = await leetcodeAuth.getUserInfo(d.username, d.token, d.session);
  res.json(data);
});

const questions = new Questions();

app.post("/:questionSlug/submissions", async (req, res) => {
  const data = await questions.getSubmissions(
    req.body.token,
    req.body.session,
    req.params.questionSlug
  );
  res.json(data);
});

const port = process.env.PORT || 8000;

app.listen(port);
