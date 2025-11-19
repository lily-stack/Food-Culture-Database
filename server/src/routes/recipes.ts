import express, { Request, Response } from "express";
import { Recipe } from "shared";
const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);

interface RecipesQuery {
	country?: string
	page?: number
	limit?: number
}
function getRecipes(req: Request<{}, {}, {}, RecipesQuery>, res: Response) {
	const { country, page, limit } = req.query;

	const body: Recipe[] = [
		{
			recipe_id: 0,
			user_id: '0',
			title: "Test Recipe 1",
			dish_description: "Description!!!",
			creation_date: new Date(),
			cooking_time: 0,
			servings: 0,
			recipe_steps: "step 1;"
		},
		{
			recipe_id: 1,
			user_id: '0',
			title: "Test Recipe 2",
			dish_description: "Description!!!",
			creation_date: new Date(),
			cooking_time: 0,
			servings: 0,
			recipe_steps: "step 1;"
		}
	]
	res.status(200).json(body);
}

function getRecipeById(req: Request, res: Response) {

}

export { router };
