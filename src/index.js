import Express from "express";
import Cors from "cors";
import router from "./routes.js";
import { errorHandler } from "./utils.js";

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


app.get("/", (req, res) => {
  res.send("OK");
});

app.use("/", router);

app.use(errorHandler)
;
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
