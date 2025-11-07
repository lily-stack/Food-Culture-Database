CREATE TABLE `User`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(255) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,
    `date_joined` DATETIME NOT NULL,
    `email` VARCHAR(255) NOT NULL
);
CREATE TABLE `follower`(
    `user_id` BIGINT NOT NULL,
    `followee_id` BIGINT NOT NULL,
    PRIMARY KEY(`user_id`)
);
ALTER TABLE
    `follower` ADD PRIMARY KEY(`followee_id`);
CREATE TABLE `Recipe`(
    `recipe_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` BIGINT NOT NULL,
    `dish_description` MEDIUMTEXT NOT NULL,
    `creation_date` DATETIME NOT NULL,
    `cooking_time` BIGINT NOT NULL,
    `servings` BIGINT NOT NULL,
    `recipe_steps` MEDIUMTEXT NOT NULL
);
CREATE TABLE `Favorite`(
    `favorite_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `recipe_id` BIGINT NOT NULL,
    `date_hearted` DATETIME NOT NULL
);
CREATE TABLE `ingredients`(
    `Ingredient_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ingredient_name` VARCHAR(255) NOT NULL
);
CREATE TABLE `RecipeIngredient`(
    `recipe_id` BIGINT NOT NULL,
    `ingredient_id` BIGINT NOT NULL,
    `amount_type` ENUM(
        'tsp',
        'tbsp',
        'fl oz',
        'cup',
        'pt',
        'qt',
        'gal',
        'oz',
        'lbs',
        'count'
    ) NOT NULL DEFAULT 'Cups',
    `amount_quantity` DECIMAL(8, 2) NOT NULL,
    PRIMARY KEY(`recipe_id`)
);
ALTER TABLE
    `RecipeIngredient` ADD PRIMARY KEY(`ingredient_id`);
CREATE TABLE `Tag`(
    `tag_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `tag` VARCHAR(255) NOT NULL
);
CREATE TABLE `RecipeTag`(
    `recipe_id` BIGINT NOT NULL,
    `tag_id` BIGINT NOT NULL,
    PRIMARY KEY(`recipe_id`)
);
ALTER TABLE
    `RecipeTag` ADD PRIMARY KEY(`tag_id`);
CREATE TABLE `Rating`(
    `rating_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `recipe_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `score` BIGINT NOT NULL
);
ALTER TABLE
    `Rating` ADD CONSTRAINT `rating_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`);
ALTER TABLE
    `RecipeIngredient` ADD CONSTRAINT `recipeingredient_recipe_id_foreign` FOREIGN KEY(`recipe_id`) REFERENCES `Recipe`(`recipe_id`);
ALTER TABLE
    `follower` ADD CONSTRAINT `follower_followee_id_foreign` FOREIGN KEY(`followee_id`) REFERENCES `User`(`user_id`);
ALTER TABLE
    `Favorite` ADD CONSTRAINT `favorite_recipe_id_foreign` FOREIGN KEY(`recipe_id`) REFERENCES `Recipe`(`recipe_id`);
ALTER TABLE
    `follower` ADD CONSTRAINT `follower_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`);
ALTER TABLE
    `RecipeTag` ADD CONSTRAINT `recipetag_tag_id_foreign` FOREIGN KEY(`tag_id`) REFERENCES `Recipe`(`recipe_id`);
ALTER TABLE
    `RecipeTag` ADD CONSTRAINT `recipetag_recipe_id_foreign` FOREIGN KEY(`recipe_id`) REFERENCES `Tag`(`tag_id`);
ALTER TABLE
    `RecipeIngredient` ADD CONSTRAINT `recipeingredient_ingredient_id_foreign` FOREIGN KEY(`ingredient_id`) REFERENCES `ingredients`(`Ingredient_id`);
ALTER TABLE
    `Favorite` ADD CONSTRAINT `favorite_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`);
ALTER TABLE
    `Rating` ADD CONSTRAINT `rating_recipe_id_foreign` FOREIGN KEY(`recipe_id`) REFERENCES `Recipe`(`recipe_id`);
ALTER TABLE
    `Recipe` ADD CONSTRAINT `recipe_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `User`(`user_id`);