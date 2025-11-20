import { CountryCode, RecipeDTO } from "shared";

export interface RecipeService {
	getRecipesByCountry(countryCode: CountryCode): Promise<RecipeDTO[]>
}
