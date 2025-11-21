import express, { Request, Response } from "express";
import { CountryCode, PaginatedRecipesResponse, RecipeDTO } from "shared";
import { RecipeService } from "../service/recipe/RecipeService";
import { FakeRecipeService } from "../service/recipe/FakeRecipeService";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const supabase = createClient<Database>(
	process.env["SUPABASE_URL"]!,
	process.env["SUPABASE_KEY"]!
);

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

	const { data, error } = await supabase.from('Recipe').select("*");
	if (!data || error) {
		res.status(500).send(error.message);
		return;
	}

	const recipes: RecipeDTO[] = data.map(row => ({
		recipe_id: row.recipe_id,
		user_id: row.user_id,
		title: row.title,
		dish_description: row.dish_description,
		creation_date: row.creation_date,
		cooking_time: row.cooking_time,
		servings: row.servings,
		recipe_steps: row.recipe_steps,
		img_src: "",
		ratings: 0
	}));

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
