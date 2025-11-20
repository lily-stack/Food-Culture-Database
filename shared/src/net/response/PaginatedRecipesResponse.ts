import { RecipeDTO } from "../../dto/RecipeDTO";
import { PaginatedResponse } from "./PaginatedResponse";

export interface PaginatedRecipesResponse extends PaginatedResponse {
	recipes: RecipeDTO[]
}
