export interface Recipe {
	recipe_id: number
	user_id: string
	title: string
	dish_description: string
	creation_date: Date
	cooking_time: number
	servings: number
	recipe_steps: string
}
