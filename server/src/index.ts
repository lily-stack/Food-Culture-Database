import "dotenv/config"
import express, { Request, Response } from "express";
import { router as recipeRouter } from "./routes/recipes";
import { s3Router } from "./routes/s3";

const PORT = 6767;

const app = express();
app.use(express.json());
const apiRouter = express.Router();

apiRouter.get("/test", (req: Request, res: Response) => {
  res.send("hi");
});

apiRouter.use("/recipes", recipeRouter);
apiRouter.use("/s3", s3Router);

app.use("/api", apiRouter);
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
