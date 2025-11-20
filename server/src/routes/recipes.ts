import express, { Request, Response } from "express";
import { PaginatedRecipesResponse, RecipeDTO } from "shared";
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

	const recipes: RecipeDTO[] = [
		{
			recipe_id: 0,
			user_id: '0',
			title: "Test Recipe 1",
			dish_description: "Description!!!",
			creation_date: 0,
			cooking_time: 0,
			servings: 0,
			recipe_steps: "step 1;",
			img_src: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipes%2F2024-03-bimbimbap%2Fbibimbap-074",
			ratings: 1000
		},
		{
			recipe_id: 1,
			user_id: '0',
			title: "Test Recipe 2",
			dish_description: "Description!!!",
			creation_date: 0,
			cooking_time: 0,
			servings: 0,
			recipe_steps: "step 1;",
			img_src: "https://www.beyondkimchee.com/wp-content/uploads/2023/11/jajangmyeon-black-bean-noodles-thumbnail.jpg",
			ratings: 900
		}
	]

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
