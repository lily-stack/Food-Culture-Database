import "dotenv/config"
import express, { Request, Response } from "express";
import { router as recipeRouter } from "./routes/recipes";

const PORT = 6767;

const app = express();
app.use(express.json());
const apiRouter = express.Router();

apiRouter.get("/test", (req: Request, res: Response) => {
  res.send("hi");
});

apiRouter.use("/recipes", recipeRouter);

app.use("/api", apiRouter);
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
