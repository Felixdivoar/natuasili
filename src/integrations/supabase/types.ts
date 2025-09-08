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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          adults: number
          booking_date: string
          booking_time: string | null
          children: number | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          donation_kes: number
          experience_id: string
          id: string
          option_id: string | null
          payment_status: string | null
          special_requests: string | null
          status: string | null
          subtotal_kes: number | null
          total_kes: number
          unit_price_kes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adults?: number
          booking_date: string
          booking_time?: string | null
          children?: number | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          donation_kes?: number
          experience_id: string
          id?: string
          option_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          status?: string | null
          subtotal_kes?: number | null
          total_kes: number
          unit_price_kes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adults?: number
          booking_date?: string
          booking_time?: string | null
          children?: number | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          donation_kes?: number
          experience_id?: string
          id?: string
          option_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          status?: string | null
          subtotal_kes?: number | null
          total_kes?: number
          unit_price_kes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          activities: Json | null
          capacity: number | null
          child_half_price_rule: boolean | null
          created_at: string | null
          description: string | null
          gallery: Json | null
          hero_image: string | null
          id: string
          location_text: string | null
          partner_id: string
          price_kes_adult: number
          slug: string
          themes: Json | null
          title: string
          updated_at: string | null
          visible_on_marketplace: boolean | null
        }
        Insert: {
          activities?: Json | null
          capacity?: number | null
          child_half_price_rule?: boolean | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          hero_image?: string | null
          id?: string
          location_text?: string | null
          partner_id: string
          price_kes_adult: number
          slug: string
          themes?: Json | null
          title: string
          updated_at?: string | null
          visible_on_marketplace?: boolean | null
        }
        Update: {
          activities?: Json | null
          capacity?: number | null
          child_half_price_rule?: boolean | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          hero_image?: string | null
          id?: string
          location_text?: string | null
          partner_id?: string
          price_kes_adult?: number
          slug?: string
          themes?: Json | null
          title?: string
          updated_at?: string | null
          visible_on_marketplace?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_metrics: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          last_calculated: string | null
          metric_description: string | null
          metric_key: string
          metric_label: string
          metric_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          last_calculated?: string | null
          metric_description?: string | null
          metric_key: string
          metric_label: string
          metric_value?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          last_calculated?: string | null
          metric_description?: string | null
          metric_key?: string
          metric_label?: string
          metric_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      impact_proofs: {
        Row: {
          booking_id: string
          caption: string | null
          created_at: string | null
          id: string
          url: string
        }
        Insert: {
          booking_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          url: string
        }
        Update: {
          booking_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "impact_proofs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string
          content: string
          created_at: string | null
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          booking_id: string
          content: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          booking_id?: string
          content?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_media: {
        Row: {
          alt: string | null
          created_at: string | null
          id: number
          partner_id: string | null
          sort: number | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: number
          partner_id?: string | null
          sort?: number | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: number
          partner_id?: string | null
          sort?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_media_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_profiles: {
        Row: {
          bio: string | null
          contacts: Json | null
          created_at: string | null
          id: string
          kyc_status: string | null
          location: string | null
          logo: string | null
          org_name: string
          slug: string
          team: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          contacts?: Json | null
          created_at?: string | null
          id?: string
          kyc_status?: string | null
          location?: string | null
          logo?: string | null
          org_name: string
          slug: string
          team?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          contacts?: Json | null
          created_at?: string | null
          id?: string
          kyc_status?: string | null
          location?: string | null
          logo?: string | null
          org_name?: string
          slug?: string
          team?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          contact_email: string | null
          created_at: string | null
          hero_image_url: string | null
          id: string
          lat: number | null
          lng: number | null
          location_text: string | null
          logo_image_url: string | null
          long_bio: string | null
          name: string
          short_bio: string | null
          slug: string
          socials: Json | null
          stats: Json | null
          tagline: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          hero_image_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          location_text?: string | null
          logo_image_url?: string | null
          long_bio?: string | null
          name: string
          short_bio?: string | null
          slug: string
          socials?: Json | null
          stats?: Json | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          hero_image_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          location_text?: string | null
          logo_image_url?: string | null
          long_bio?: string | null
          name?: string
          short_bio?: string | null
          slug?: string
          socials?: Json | null
          stats?: Json | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string | null
          event: Json
          id: number
          order_tracking_id: string
        }
        Insert: {
          created_at?: string | null
          event: Json
          id?: number
          order_tracking_id: string
        }
        Update: {
          created_at?: string | null
          event?: Json
          id?: number
          order_tracking_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          order_tracking_id: string
          payment_data: Json | null
          pesapal_transaction_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          order_tracking_id: string
          payment_data?: Json | null
          pesapal_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          order_tracking_id?: string
          payment_data?: Json | null
          pesapal_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount_kes: number
          created_at: string | null
          id: string
          partner_id: string
          payout_date: string
          reference: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_kes: number
          created_at?: string | null
          id?: string
          partner_id: string
          payout_date: string
          reference?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_kes?: number
          created_at?: string | null
          id?: string
          partner_id?: string
          payout_date?: string
          reference?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          experience_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          experience_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          experience_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      promote_to_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      update_impact_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "partner" | "user"
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
    Enums: {
      app_role: ["admin", "partner", "user"],
    },
  },
} as const
