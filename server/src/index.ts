import express, { Request, Response, Router } from "express";

const app = express();
app.use(express.json());
const apiRouter = Router();

apiRouter.get("/test", (req: Request, res: Response) => {
  res.send("hi");
});

app.use("/api", apiRouter);
app.listen(6767, () => console.log("server up"));
