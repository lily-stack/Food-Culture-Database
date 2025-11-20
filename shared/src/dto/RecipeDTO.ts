export interface RecipeDTO {
	recipe_id: number
	user_id: string
	title: string
	dish_description: string
	creation_date: number
	cooking_time: number
	servings: number
	recipe_steps: string
	img_src: string
	ratings: number
}
