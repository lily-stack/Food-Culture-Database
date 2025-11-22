import { Recipe } from "../../types/Recipe";
import { PaginatedResponse } from "./PaginatedResponse";

export interface PaginatedRecipesResponse extends PaginatedResponse {
	recipes: Recipe[]
}
