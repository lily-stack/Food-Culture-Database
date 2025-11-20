import express, { Request, Response } from "express";
import { CountryCode, PaginatedRecipesResponse, RecipeDTO } from "shared";
import { RecipeService } from "../service/recipe/RecipeService";
import { FakeRecipeService } from "../service/recipe/FakeRecipeService";

const recipeService: RecipeService = new FakeRecipeService();

const router = express.Router();
router.get('/', getRecipes);
router.get('/:id', getRecipeById);

interface RecipesQuery {
	country?: string
	page?: number
	limit?: number
}
async function getRecipes(req: Request<{}, {}, {}, RecipesQuery>, res: Response) {
	const { country, page, limit } = req.query as {
		country?: CountryCode
		page?: string
		limit?: string
	};

	if (!country) {
		res.status(400);
		return;
	}

	const recipes = await recipeService.getRecipesByCountry(country);
	const body: PaginatedRecipesResponse = {
		recipes,
		page: 1,
		pageSize: 10,
		totalItems: 2,
		totalPages: 1
	}
	res.status(200).json(body);
}

function getRecipeById(req: Request, res: Response) {

}

export { router };
