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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number
          display_order: number
          id: string
          is_active: boolean
          name: string
          price: number
          product_id: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          price: number
          product_id: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          product_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views_daily: {
        Row: {
          product_id: string
          viewed_on: string
          views: number
        }
        Insert: {
          product_id: string
          viewed_on: string
          views?: number
        }
        Update: {
          product_id?: string
          viewed_on?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_views_daily_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string
          category_id: string
          created_at: string
          id: string
          is_popular: boolean
          name: string
        }
        Insert: {
          brand_id: string
          category_id: string
          created_at?: string
          id?: string
          is_popular?: boolean
          name: string
        }
        Update: {
          brand_id?: string
          category_id?: string
          created_at?: string
          id?: string
          is_popular?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      province_sales_entries: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          note: string | null
          province_id: number
          quantity: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: never
          note?: string | null
          province_id: number
          quantity: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: never
          note?: string | null
          province_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "province_sales_entries_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "province_sales_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "province_sales_entries_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          id: number
          lat: number
          lng: number
          name: string
          slug: string
        }
        Insert: {
          id?: never
          lat: number
          lng: number
          name: string
          slug: string
        }
        Update: {
          id?: never
          lat?: number
          lng?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      variant_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          path: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          path: string
          variant_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          path?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_sizes: {
        Row: {
          created_at: string
          id: string
          size: string
          stock: number
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          size: string
          stock?: number
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          size?: string
          stock?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_sizes_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      province_sales_summary: {
        Row: {
          id: number | null
          lat: number | null
          lng: number | null
          name: string | null
          slug: string | null
          total_sales: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: never
        Returns: {
          active_variants: number
          inactive_variants: number
          products_on_sale: number
          sold_out_variants: number
          total_categories: number
          total_products: number
        }[]
      }
      get_top_viewed_products: {
        Args: { p_days?: number; p_limit?: number }
        Returns: {
          id: string
          name: string
          views: number
        }[]
      }
      record_product_view: {
        Args: { p_variant_id: string }
        Returns: undefined
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
