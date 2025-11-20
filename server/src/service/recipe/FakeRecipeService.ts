import { CountryCode, RecipeDTO } from "shared";
import { RecipeService } from "./RecipeService";

export class FakeRecipeService implements RecipeService {
	public async getRecipesByCountry(countryCode: CountryCode): Promise<RecipeDTO[]> {
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
			},
			{
				recipe_id: 2,
				user_id: '0',
				title: "Test Recipe 3",
				dish_description: "Description!!!",
				creation_date: 0,
				cooking_time: 0,
				servings: 0,
				recipe_steps: "",
				img_src: "",
				ratings: 0
			},
			{
				recipe_id: 3,
				user_id: '0',
				title: "Test Recipe 4",
				dish_description: "Description!!!",
				creation_date: 0,
				cooking_time: 0,
				servings: 0,
				recipe_steps: "",
				img_src: "",
				ratings: 0
			},
			{
				recipe_id: 4,
				user_id: '0',
				title: "Test Recipe 5",
				dish_description: "Description!!!",
				creation_date: 0,
				cooking_time: 0,
				servings: 0,
				recipe_steps: "",
				img_src: "",
				ratings: 0
			},
			{
				recipe_id: 5,
				user_id: '0',
				title: "Test Recipe 6",
				dish_description: "Description!!!",
				creation_date: 0,
				cooking_time: 0,
				servings: 0,
				recipe_steps: "",
				img_src: "",
				ratings: 0
			},
			{
				recipe_id: 6,
				user_id: '0',
				title: "Test Recipe 7",
				dish_description: "Description!!!",
				creation_date: 0,
				cooking_time: 0,
				servings: 0,
				recipe_steps: "",
				img_src: "",
				ratings: 0
			},
			{
				recipe_id: 7,
				user_id: '0',
				title: "Test Recipe 8",
				dish_description: "Description!!!",
				creation_date: 0,
				cooking_time: 0,
				servings: 0,
				recipe_steps: "",
				img_src: "",
				ratings: 0
			}
		]
		return recipes;
	}
}
