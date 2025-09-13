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
      cart_items: {
        Row: {
          adults: number
          cart_id: string
          children: number
          created_at: string
          date: string | null
          experience_slug: string
          id: string
          option_id: string
          subtotal_kes: number
          unit_price_kes: number
        }
        Insert: {
          adults?: number
          cart_id: string
          children?: number
          created_at?: string
          date?: string | null
          experience_slug: string
          id?: string
          option_id?: string
          subtotal_kes?: number
          unit_price_kes?: number
        }
        Update: {
          adults?: number
          cart_id?: string
          children?: number
          created_at?: string
          date?: string | null
          experience_slug?: string
          id?: string
          option_id?: string
          subtotal_kes?: number
          unit_price_kes?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_logs: {
        Row: {
          id: string
          query: string
          response: string
          species_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          query: string
          response: string
          species_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          query?: string
          response?: string
          species_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_logs_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species_data"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          activities: Json | null
          best_seasons: number[] | null
          capacity: number | null
          categories: string[] | null
          child_half_price_rule: boolean | null
          created_at: string | null
          description: string | null
          donation_options: Json | null
          duration_hours: number | null
          gallery: Json | null
          hero_image: string | null
          id: string
          location_text: string | null
          min_capacity: number | null
          partner_id: string
          price_kes_adult: number
          slug: string
          species_likely: string[] | null
          themes: Json | null
          title: string
          unsuitable_weather: string[] | null
          updated_at: string | null
          visible_on_marketplace: boolean | null
        }
        Insert: {
          activities?: Json | null
          best_seasons?: number[] | null
          capacity?: number | null
          categories?: string[] | null
          child_half_price_rule?: boolean | null
          created_at?: string | null
          description?: string | null
          donation_options?: Json | null
          duration_hours?: number | null
          gallery?: Json | null
          hero_image?: string | null
          id?: string
          location_text?: string | null
          min_capacity?: number | null
          partner_id: string
          price_kes_adult: number
          slug: string
          species_likely?: string[] | null
          themes?: Json | null
          title: string
          unsuitable_weather?: string[] | null
          updated_at?: string | null
          visible_on_marketplace?: boolean | null
        }
        Update: {
          activities?: Json | null
          best_seasons?: number[] | null
          capacity?: number | null
          categories?: string[] | null
          child_half_price_rule?: boolean | null
          created_at?: string | null
          description?: string | null
          donation_options?: Json | null
          duration_hours?: number | null
          gallery?: Json | null
          hero_image?: string | null
          id?: string
          location_text?: string | null
          min_capacity?: number | null
          partner_id?: string
          price_kes_adult?: number
          slug?: string
          species_likely?: string[] | null
          themes?: Json | null
          title?: string
          unsuitable_weather?: string[] | null
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
      extracted_metrics: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          metric_type: string
          notes: string | null
          quantity: number
          unit: string
          upload_id: string
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          metric_type: string
          notes?: string | null
          quantity: number
          unit: string
          upload_id: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          metric_type?: string
          notes?: string | null
          quantity?: number
          unit?: string
          upload_id?: string
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extracted_metrics_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "partner_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_dashboard: {
        Row: {
          created_at: string | null
          id: string
          metrics_json: Json | null
          narrative: string | null
          partner_id: string
          period_end: string
          period_start: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metrics_json?: Json | null
          narrative?: string | null
          partner_id: string
          period_end: string
          period_start: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metrics_json?: Json | null
          narrative?: string | null
          partner_id?: string
          period_end?: string
          period_start?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_dashboard_partner_id_fkey"
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
          admin_notes: string | null
          booking_id: string
          caption: string | null
          created_at: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          url: string
        }
        Insert: {
          admin_notes?: string | null
          booking_id: string
          caption?: string | null
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          url: string
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
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
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      partner_uploads: {
        Row: {
          file_type: string
          file_url: string
          id: string
          partner_id: string
          processed_at: string | null
          status: string | null
          uploaded_at: string | null
        }
        Insert: {
          file_type: string
          file_url: string
          id?: string
          partner_id: string
          processed_at?: string | null
          status?: string | null
          uploaded_at?: string | null
        }
        Update: {
          file_type?: string
          file_url?: string
          id?: string
          partner_id?: string
          processed_at?: string | null
          status?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_uploads_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      review_helpful_votes: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string
          created_at: string
          experience_id: string
          helpful_count: number
          id: string
          rating: number
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          booking_id: string
          comment: string
          created_at?: string
          experience_id: string
          helpful_count?: number
          id?: string
          rating: number
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          booking_id?: string
          comment?: string
          created_at?: string
          experience_id?: string
          helpful_count?: number
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      species_data: {
        Row: {
          classification: Json | null
          common_name: string
          created_at: string | null
          description: string | null
          distribution: string | null
          habitat: string | null
          id: string
          last_updated: string | null
          population_status: string | null
          scientific_name: string
          source: string
          threats: string[] | null
        }
        Insert: {
          classification?: Json | null
          common_name: string
          created_at?: string | null
          description?: string | null
          distribution?: string | null
          habitat?: string | null
          id?: string
          last_updated?: string | null
          population_status?: string | null
          scientific_name: string
          source?: string
          threats?: string[] | null
        }
        Update: {
          classification?: Json | null
          common_name?: string
          created_at?: string | null
          description?: string | null
          distribution?: string | null
          habitat?: string | null
          id?: string
          last_updated?: string | null
          population_status?: string | null
          scientific_name?: string
          source?: string
          threats?: string[] | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          adventure_level: string | null
          created_at: string | null
          donation_interest: boolean | null
          group_type: string | null
          id: string
          preferences_json: Json | null
          preferred_quiz_time: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adventure_level?: string | null
          created_at?: string | null
          donation_interest?: boolean | null
          group_type?: string | null
          id?: string
          preferences_json?: Json | null
          preferred_quiz_time?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adventure_level?: string | null
          created_at?: string | null
          donation_interest?: boolean | null
          group_type?: string | null
          id?: string
          preferences_json?: Json | null
          preferred_quiz_time?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
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
      wildlife_activity: {
        Row: {
          activity_level: number | null
          created_at: string | null
          id: string
          location: string
          month: number
          species_id: string
        }
        Insert: {
          activity_level?: number | null
          created_at?: string | null
          id?: string
          location: string
          month: number
          species_id: string
        }
        Update: {
          activity_level?: number | null
          created_at?: string | null
          id?: string
          location?: string
          month?: number
          species_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wildlife_activity_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species_data"
            referencedColumns: ["id"]
          },
        ]
      }
      wildlife_quiz_log: {
        Row: {
          ai_species: string[] | null
          correct_count: number | null
          created_at: string | null
          date: string
          id: string
          photos_uploaded: string[] | null
          species_spotted: string[] | null
          user_id: string
        }
        Insert: {
          ai_species?: string[] | null
          correct_count?: number | null
          created_at?: string | null
          date?: string
          id?: string
          photos_uploaded?: string[] | null
          species_spotted?: string[] | null
          user_id: string
        }
        Update: {
          ai_species?: string[] | null
          correct_count?: number | null
          created_at?: string | null
          date?: string
          id?: string
          photos_uploaded?: string[] | null
          species_spotted?: string[] | null
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
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount_kes: number
          created_at: string
          id: string
          partner_id: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount_kes: number
          created_at?: string
          id?: string
          partner_id: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount_kes?: number
          created_at?: string
          id?: string
          partner_id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
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
      mark_message_read: {
        Args: { message_id: string }
        Returns: undefined
      }
      promote_to_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
      setup_admin_user_post_creation: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      simulate_metric_growth: {
        Args: Record<PropertyKey, never>
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
