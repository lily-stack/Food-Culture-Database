import { CountryCode } from "../types/CountryCode"

export interface Recipe {
	recipe_id: number
	user_id: string
	title: string
	dish_description: string
	creation_date: string
	cooking_time: number
	servings: number
	recipe_steps: string
	image_src: string
	rating: number
	countries: CountryCode[]
}
