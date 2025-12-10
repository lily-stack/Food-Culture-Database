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
	country?: CountryCode
	page?: number
	limit?: number
	sortby?: 'date' | 'popularity'
}

/**
 * Gets recipes, paginated. Currently supports filtering by country code and sorting by date.
 * TODO: Support filtering by user.
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
	} else if (sortby === 'popularity') {
		query = query.order('rating', {
			ascending: false,
			nullsFirst: false
		});
	}
	query = query.range((pageNum - 1) * limit, pageNum * limit - 1);

	const { data, count, error } = await query;
	if (error) {
		res.status(500).send(error.message);
		return;
	}

	const recipes: Recipe[] = (data ?? []).map(row => ({
		...row
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

export async function getRecipeById(req: Request, res: Response) {
  const recipeId = req.params.id;
  if (!recipeId) return res.status(400).send("Missing recipe ID");

  const recipeIdNum = Number(recipeId);
  if (isNaN(recipeIdNum)) return res.status(400).send("Invalid recipe ID");

  try {
    const { data: recipeData, error: recipeError } = await supabase
      .from("recipe_model") // ensure correct table name
      .select("*")
      .eq("recipe_id", recipeIdNum)
      .single();

    if (recipeError || !recipeData) {
      return res.status(404).send("Recipe not found");
    }

    // Ingredients
    const { data: ingredientsData } = await supabase
      .from("RecipeIngredient")
      .select(`amount_quantity, Ingredient(ingredient_id, ingredient_name)`)
      .eq("recipe_id", recipeIdNum);

    const ingredients = (ingredientsData ?? []).map((ri: any) => ({
      ingredient_id: ri.Ingredient?.ingredient_id ?? 0,
      ingredient_name: ri.Ingredient?.ingredient_name ?? "",
      amount_quantity: ri.amount_quantity ?? 0
    }));

    // Tags
    const { data: tagsData } = await supabase
      .from("RecipeTag")
      .select(`Tag(tag_id, tag_name)`)
      .eq("recipe_id", recipeIdNum);

    const tags = (tagsData ?? []).map((t: any) => t.Tag?.tag_name ?? "");

    // Countries
    const { data: countriesData } = await supabase
      .from("RecipeCountry")
      .select("country_code")
      .eq("recipe_id", recipeIdNum);

    const countries = (countriesData ?? []).map((c: any) => c.country_code);

    const {data: createrData} = await supabase
      .from("recipe_model")
      .select("user_id")
      .eq("recipe_id", recipeIdNum)
      .single();

    const creater = createrData?.user_id ?? null;

    const response = {
      ...recipeData,
      recipe_steps: recipeData.recipe_steps ? recipeData.recipe_steps.split("\n") : [],
      ingredients,
      tags,
      countries,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error fetching recipe:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getRecipeOfTheDay(req: Request, res: Response<Recipe>) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const { count: numRecipes, error: countError } = await supabase
		.from('Recipe')
		.select('*', { count: 'exact', head: true })
		// Only consider recipes from before today in the count (so that creating a new recipe will not change this count)
		.lt('creation_date', today.toISOString());

	if (countError || numRecipes == null) {
		res.status(500).send();
		return;
	}

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
			...data
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
  image_src?: string;
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
      image_src: recipe.image_src ?? ""
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

router.get('/user/:userid', requireAuth, async (req: Request, res: Response) => {
  const userId = req.params.userid;

  if (!userId) return res.status(400).send("Missing user ID");

  try {
    const { data, error } = await supabase
      .from("recipe_model")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).send(error.message);
    }

    const recipes = (data ?? []).map(row => ({
      ...row,
      image_src: row.image_src || ""
    }));

    res.json(recipes);
  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
});


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

router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  const recipeId = Number(req.params.id);
  if (isNaN(recipeId)) return res.status(400).send("Invalid recipe ID");

  try {
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('Recipe')
      .select('*')
      .eq('recipe_id', recipeId)
      .single();

    if (fetchError || !existingRecipe) {
      return res.status(404).send("Recipe not found");
    }

    if (existingRecipe.user_id !== req.user!.sub) {
      return res.status(403).send("Forbidden: cannot edit another user's recipe");
    }

    const updateData = {
      title: req.body.title,
      dish_description: req.body.dish_description ?? "",
      cooking_time: req.body.cooking_time ?? 0,
      servings: req.body.servings ?? 1,
      recipe_steps: req.body.recipe_steps ?? "",
      image_src: req.body.image_src ?? ""
    };

    const { data: updatedRecipe, error: updateError } = await supabase
      .from('Recipe')
      .update(updateData)
      .eq('recipe_id', recipeId)
      .select()
      .single();

    if (updateError || !updatedRecipe) {
      return res.status(500).send(updateError?.message || "Failed to update recipe");
    }

    res.json(updatedRecipe);
  } catch (error: any) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});


export { router };








