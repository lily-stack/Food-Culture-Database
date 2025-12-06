import express, { Request, Response } from "express";
import { CountryCode, PaginatedRecipesResponse, Recipe } from "shared";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import seedrandom from "seedrandom";

const supabase = createClient<Database>(
	process.env["SUPABASE_URL"]!,
	process.env["SUPABASE_KEY"]!
);

const router = express.Router();
router.get('/', getRecipes);
router.get('/daily', getRecipeOfTheDay);
router.get('/:id', getRecipeById);

interface RecipesQuery {
	country?: CountryCode
	page?: number
	limit?: number
	sortby?: 'date' | 'popularity'
}

/**
 * Gets recipes, paginated. Currently supports filtering by country code and sorting by date.
 * TODO: Support filtering by user.
 * TODO: Support sorting by popularity (rating).
 * Example usage:
 * /api/recipes?country=kr&page=1&sortby=date
 */
async function getRecipes(req: Request<{}, {}, {}, RecipesQuery>, res: Response) {
	const { country, page, sortby } = req.query;

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
			...RecipeCountry!inner()
		`, { count: "exact" });
	if (country) {
		query = query.eq("RecipeCountry.country_code", country);
	}
	if (sortby === 'date') {
		query = query.order('creation_date', {
			ascending: false,
		});
	}
	query = query.range((pageNum - 1) * limit, pageNum * limit - 1);

	const { data, count, error } = await query;
	if (error) {
		res.status(500).send(error.message);
		return;
	}

	const recipes: Recipe[] = (data ?? []).map(row => ({
		...row,
		img_src: ""
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

	if (error || !data) {
		res.status(404).send();
	} else {
		const recipe = {
			...data,
			img_src: "",
			ratings: data.rating,
			countries: data.countries as CountryCode[]
		} as Recipe
		res.status(200).send(recipe);
	}
}


async function getRecipeOfTheDay(req: Request, res: Response<Recipe>) {
	const { count: numRecipes, error: countError } = await supabase
		.from('Recipe')
		.select('*', { count: 'exact', head: true });
	if (countError || numRecipes == null) {
		res.status(500).send();
		return;
	}

	const today = new Date();
	const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
	const rng = seedrandom(seed.toString());
	const index = Math.floor(rng() * numRecipes);

	const { data, error } = await supabase
		.from('recipe_model')
		.select('*')
		.range(index, index)
		.single();

	if (error || !data) {
		res.status(500).send();
	} else {
		const recipe = {
			...data,
			img_src: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipes%2F2024-03-bimbimbap%2Fbibimbap-074",
		} as Recipe
		res.status(200).send(recipe)
	}
}

export { router };
