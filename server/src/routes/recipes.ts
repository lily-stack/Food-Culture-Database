import express, { Request, Response, NextFunction } from "express";
import { CountryCode, PaginatedRecipesResponse, Recipe } from "shared";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";
import seedrandom from "seedrandom";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import axios from "axios";
import { JwtPayload } from "jsonwebtoken";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

let jwksCache: any = null;

export async function verifyCognitoToken(token: string) {
  try {
    // 1. Load JWKS if not cached
    if (!jwksCache) {
      const region = "us-east-1";                
      const userPoolId = "us-east-1_aT4dqxsZq";

      const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
      const { data } = await axios.get(url);
      jwksCache = data;
    }

    // 2. Decode header (base64url!)
    const header = JSON.parse(
      Buffer.from(token.split(".")[0], "base64url").toString("utf8")
    );

    // 3. Find the matching JWK
    const jwk = jwksCache.keys.find((key: any) => key.kid === header.kid);
    if (!jwk) throw new Error("Unable to find matching JWK");

    // 4. Convert JWK → PEM and verify token
    const pem = jwkToPem(jwk);

    return jwt.verify(token, pem, {
      issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_aT4dqxsZq`,
    });

  } catch (err) {
    console.error("JWT verification failed:", err);
    throw new Error("Unauthorized");
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send("Missing Authorization header");
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).send("Invalid Authorization header");
      return;
    }

    const decoded = await verifyCognitoToken(token);
    if (!decoded || typeof decoded === "string" || !("sub" in decoded)) {
      res.status(401).send("Invalid token payload");
      return;
    } 

    if (!decoded || typeof decoded === "string" || !("sub" in decoded)) {
      res.status(401).send("Invalid token payload");
      return;
    }

    const payload = decoded as JwtPayload & { sub: string; email?: string };
    req.user = { sub: payload.sub, email: payload.email };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send("Invalid token");
  }
}




const router = express.Router();
router.get('/', getRecipes);
router.get('/daily', getRecipeOfTheDay);
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
			...RecipeCountry!inner()
		`, { count: "exact" });
	if (country) {
		query = query.eq("RecipeCountry.country_code", country);
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
			img_src: "",
		} as Recipe
		res.status(200).send(recipe)
	}
}

interface IngredientPayload {
  ingredient_name: string; 
  amount_quantity?: number; 
  unit?: string;
}

interface RecipePayload {
  user_id: string;
  title: string;
  dish_description?: string;
  cooking_time?: number;
  servings?: number;
  recipe_steps?: string;
  tags?: string[];
  countries?: string[];
  rating?: number;
  ingredients?: IngredientPayload[];
}

export async function createRecipe(recipe: RecipePayload) {
  const { data: recipeData, error: recipeError } = await supabase
    .from("Recipe")
    .insert({
      user_id: recipe.user_id,
      title: recipe.title,
      dish_description: recipe.dish_description ?? "",
      cooking_time: recipe.cooking_time ?? 0,
      servings: recipe.servings ?? 1,
      recipe_steps: recipe.recipe_steps ?? "",
      creation_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (recipeError || !recipeData) {
    throw new Error(recipeError?.message || "Failed to create recipe");
  }

  const recipe_id = recipeData.recipe_id;

  if (recipe.ingredients && recipe.ingredients.length > 0) {
    await Promise.all(
      recipe.ingredients.map(async (ing) => {
        // check or insert ingredient
        const { data: existingIngredient } = await supabase
          .from("Ingredient")
          .select("ingredient_id")
          .eq("ingredient_name", ing.ingredient_name)
          .single();

        let ingredient_id: number;
        if (existingIngredient) {
          ingredient_id = existingIngredient.ingredient_id;
        } else {
          const { data: newIngredient, error: insertError } =
            await supabase
              .from("Ingredient")
              .insert({ ingredient_name: ing.ingredient_name })
              .select()
              .single();
          if (insertError || !newIngredient) {
            throw new Error(insertError?.message || "Failed to insert ingredient");
          }
          ingredient_id = newIngredient.ingredient_id;
        }

        // link recipe + ingredient
        const { error: linkError } = await supabase
          .from("RecipeIngredient")
          .insert({
            recipe_id,
            ingredient_id,
            amount_quantity: ing.amount_quantity ?? 0,
          });

        if (linkError) {
          throw new Error(linkError.message);
        }
      })
    );
  }

  // Insert tags
  if (recipe.tags && recipe.tags.length > 0) {
    await Promise.all(
      recipe.tags.map(async (tagName: string) => {
        const { data: existingTag } = await supabase
          .from("Tag")
          .select("tag_id")
          .eq("tag_name", tagName)
          .single();

        let tag_id: number;
        if (existingTag) {
          tag_id = existingTag.tag_id;
        } else {
          const { data: newTag, error: newTagError } = await supabase
            .from("Tag")
            .insert({ tag: tagName })
            .select()
            .single();

          if (newTagError) throw new Error(newTagError.message);
          tag_id = newTag.tag_id;
        }

        const { error: linkError } = await supabase
          .from("RecipeTag")
          .insert({ recipe_id, tag_id });

        if (linkError) throw new Error(linkError.message);
      })
    );
  }

  // Insert countries (if any)
  if (recipe.countries && recipe.countries.length > 0) {
    await Promise.all(
      recipe.countries.map(async (country_code) => {
        const { error: countryError } = await supabase
          .from("RecipeCountry")
          .insert({ recipe_id, country_code });

        if (countryError) {
          throw new Error(countryError.message);
        }
      })
    );
  }

  // Optionally, insert a rating record if provided
  if (recipe.rating !== undefined) {
    const { data: ratingData, error: ratingError } = await supabase
      .from("Rating")
      .insert({
        recipe_id,
        user_id: recipe.user_id,
        score: recipe.rating,
      })
      .select()
      .single();

    if (ratingError) {
      console.error("Failed to insert initial rating:", ratingError);
    }
  }

  return recipeData;
}

router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.sub;

      const recipeData = await createRecipe({
        ...req.body,
        user_id: userId
      });

      res.status(201).json(recipeData);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);


// router.post("/", async (req: Request<{}, {}, RecipePayload>, res: Response) => {
//   try {
//     const recipeData = await createRecipe(req.body);
//     res.status(201).json(recipeData);
//   } catch (error: any) {
//     console.error("Error creating recipe:", error);
//     res.status(500).send(error.message);
//   }
// });

export { router };








