export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      Country: {
        Row: {
          country_id: number
          country_name: string
        }
        Insert: {
          country_id?: number
          country_name: string
        }
        Update: {
          country_id?: number
          country_name?: string
        }
        Relationships: []
      }
      Favorite: {
        Row: {
          date_hearted: string | null
          favorite_id: number
          recipe_id: number | null
          user_id: string
        }
        Insert: {
          date_hearted?: string | null
          favorite_id?: number
          recipe_id?: number | null
          user_id: string
        }
        Update: {
          date_hearted?: string | null
          favorite_id?: number
          recipe_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Favorite_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "Recipe"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "Favorite_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["user_id"]
          },
        ]
      }
      Follower: {
        Row: {
          followee_id: string
          user_id: string
        }
        Insert: {
          followee_id: string
          user_id: string
        }
        Update: {
          followee_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Follower_followee_id_fkey"
            columns: ["followee_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Follower_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["user_id"]
          },
        ]
      }
      Ingredient: {
        Row: {
          ingredient_id: number
          ingredient_name: string
        }
        Insert: {
          ingredient_id?: number
          ingredient_name: string
        }
        Update: {
          ingredient_id?: number
          ingredient_name?: string
        }
        Relationships: []
      }
      Rating: {
        Row: {
          rating_id: number
          recipe_id: number
          score: number | null
          user_id: string | null
        }
        Insert: {
          rating_id?: number
          recipe_id: number
          score?: number | null
          user_id?: string | null
        }
        Update: {
          rating_id?: number
          recipe_id?: number
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Rating_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "Recipe"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "Rating_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["user_id"]
          },
        ]
      }
      Recipe: {
        Row: {
          cooking_time: number
          creation_date: string
          dish_description: string
          recipe_id: number
          recipe_steps: string
          servings: number
          title: string
          user_id: string
        }
        Insert: {
          cooking_time: number
          creation_date?: string
          dish_description: string
          recipe_id?: number
          recipe_steps: string
          servings: number
          title: string
          user_id: string
        }
        Update: {
          cooking_time?: number
          creation_date?: string
          dish_description?: string
          recipe_id?: number
          recipe_steps?: string
          servings?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      RecipeCountry: {
        Row: {
          country_id: number
          recipe_id: number
        }
        Insert: {
          country_id: number
          recipe_id?: number
        }
        Update: {
          country_id?: number
          recipe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "RecipeCountry_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "Country"
            referencedColumns: ["country_id"]
          },
          {
            foreignKeyName: "RecipeCountry_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "Recipe"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      RecipeIngredient: {
        Row: {
          amount_quantity: number | null
          ingredient_id: number
          recipe_id: number
        }
        Insert: {
          amount_quantity?: number | null
          ingredient_id: number
          recipe_id: number
        }
        Update: {
          amount_quantity?: number | null
          ingredient_id?: number
          recipe_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "RecipeIngredient_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: true
            referencedRelation: "Ingredient"
            referencedColumns: ["ingredient_id"]
          },
          {
            foreignKeyName: "RecipeIngredient_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "Recipe"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      RecipeTag: {
        Row: {
          recipe_id: number
          tag_id: number
        }
        Insert: {
          recipe_id: number
          tag_id: number
        }
        Update: {
          recipe_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "RecipeTag_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "Recipe"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "RecipeTag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      Tag: {
        Row: {
          tag: string
          tag_id: number
        }
        Insert: {
          tag: string
          tag_id?: number
        }
        Update: {
          tag?: string
          tag_id?: number
        }
        Relationships: []
      }
      User: {
        Row: {
          user_id: string
          user_name: string
        }
        Insert: {
          user_id: string
          user_name: string
        }
        Update: {
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
