-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Country (
  country_name character varying NOT NULL,
  country_code character varying NOT NULL,
  CONSTRAINT Country_pkey PRIMARY KEY (country_code)
);
CREATE TABLE public.Favorite (
  favorite_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  recipe_id bigint,
  date_hearted timestamp with time zone,
  CONSTRAINT Favorite_pkey PRIMARY KEY (favorite_id),
  CONSTRAINT Favorite_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT Favorite_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.Recipe(recipe_id)
);
CREATE TABLE public.Follower (
  user_id uuid NOT NULL,
  followee_id uuid NOT NULL,
  CONSTRAINT Follower_pkey PRIMARY KEY (user_id, followee_id),
  CONSTRAINT Follower_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT Follower_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.User(user_id)
);
CREATE TABLE public.Ingredient (
  ingredient_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  ingredient_name character varying NOT NULL,
  CONSTRAINT Ingredient_pkey PRIMARY KEY (ingredient_id)
);
CREATE TABLE public.Rating (
  rating_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  recipe_id bigint NOT NULL,
  user_id uuid,
  score real,
  CONSTRAINT Rating_pkey PRIMARY KEY (rating_id),
  CONSTRAINT Rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.User(user_id),
  CONSTRAINT Rating_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.Recipe(recipe_id)
);
CREATE TABLE public.Recipe (
  recipe_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  title character varying NOT NULL,
  dish_description text NOT NULL,
  creation_date timestamp with time zone NOT NULL DEFAULT now(),
  cooking_time bigint NOT NULL,
  servings bigint NOT NULL,
  recipe_steps text NOT NULL,
  CONSTRAINT Recipe_pkey PRIMARY KEY (recipe_id)
);
CREATE TABLE public.RecipeCountry (
  recipe_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  country_code character varying NOT NULL,
  CONSTRAINT RecipeCountry_pkey PRIMARY KEY (recipe_id, country_code),
  CONSTRAINT RecipeCountry_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.Recipe(recipe_id),
  CONSTRAINT RecipeCountry_country_code_fkey FOREIGN KEY (country_code) REFERENCES public.Country(country_code)
);
CREATE TABLE public.RecipeIngredient (
  recipe_id bigint NOT NULL UNIQUE,
  ingredient_id bigint NOT NULL UNIQUE,
  amount_quantity numeric,
  CONSTRAINT RecipeIngredient_pkey PRIMARY KEY (recipe_id, ingredient_id),
  CONSTRAINT RecipeIngredient_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.Ingredient(ingredient_id),
  CONSTRAINT RecipeIngredient_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.Recipe(recipe_id)
);
CREATE TABLE public.RecipeTag (
  recipe_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT RecipeTag_pkey PRIMARY KEY (recipe_id, tag_id),
  CONSTRAINT RecipeTag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.Tag(tag_id),
  CONSTRAINT RecipeTag_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.Recipe(recipe_id)
);
CREATE TABLE public.Tag (
  tag_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tag character varying NOT NULL,
  CONSTRAINT Tag_pkey PRIMARY KEY (tag_id)
);
CREATE TABLE public.User (
  user_id uuid NOT NULL,
  user_name character varying NOT NULL,
  CONSTRAINT User_pkey PRIMARY KEY (user_id)
);