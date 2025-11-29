import express, { Request, Response } from "express";
import { CountryCode, PaginatedRecipesResponse, Recipe } from "shared";
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

/**
 * Gets recipes, paginated. Currently supports filtering by country code.
 * TODO: Support filtering by user.
 * Example usage:
 * /api/recipes?country=kr&page=1
 */
async function getRecipes(req: Request<{}, {}, {}, RecipesQuery>, res: Response) {
	const { country, page } = req.query;

	const limit = 10;
	const pageNum = Math.max(1, Number(page) || 1);

	if (!page) {
		res.status(400).send("Missing page parameter");
		return;
	}

	let query = supabase
		.from('recipe_model')
		.select(`
			*,
			...RecipeCountry!inner(
				country_code
			)
		`, { count: "exact" });
	if (country) {
		query = query.eq('RecipeCountry.country_code', country);
	}
	query = query.range((pageNum - 1) * limit, pageNum * limit - 1);

	const { data, count, error } = await query;
	if (error) {
		res.status(500).send(error.message);
		return;
	}

	const recipes: Recipe[] = (data ?? []).map(row => ({
		recipe_id: row.recipe_id,
		user_id: row.user_id,
		title: row.title,
		dish_description: row.dish_description,
		creation_date: row.creation_date,
		cooking_time: row.cooking_time,
		servings: row.servings,
		recipe_steps: row.recipe_steps,
		img_src: "",
		ratings: row.rating,
		countries: row.country_code as CountryCode[]
	}) as Recipe);

	const totalPages = count ? Math.ceil(count / limit) : 0;

	const body: PaginatedRecipesResponse = {
		recipes,
		page: pageNum,
		pageSize: limit,
		totalItems: count ?? 0,
		totalPages
	}
	res.status(200).json(body);
}


/**
 * Gets a specific recipe by id.
 * Example usage:
 * /api/recipes/1
 * (where 1 is the recipe_id)
 */
async function getRecipeById(req: Request, res: Response<Recipe>) {
	const recipeId = req.params.id;
	if (recipeId == null) {
		res.status(400).send();
	}

	const { data, error } = await supabase
		.from('recipe_model')
		.select(`*`)
		.eq('recipe_id', +recipeId)
		.single();

	if (data) {
		const recipe = {
			...data,
			img_src: "",
			ratings: data.rating,
			countries: data.countries as CountryCode[]
		} as Recipe
		res.status(200).send(recipe);
	} else {
		res.status(404).send();
	}
}

export { router };
