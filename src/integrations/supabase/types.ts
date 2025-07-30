export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_follow_ups: {
        Row: {
          agent_email: string
          created_at: string
          follow_up_type: string
          id: string
          scheduled_for: string
          sent_at: string | null
          trip_id: string
        }
        Insert: {
          agent_email: string
          created_at?: string
          follow_up_type: string
          id?: string
          scheduled_for: string
          sent_at?: string | null
          trip_id: string
        }
        Update: {
          agent_email?: string
          created_at?: string
          follow_up_type?: string
          id?: string
          scheduled_for?: string
          sent_at?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_follow_ups_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "saved_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_interactions: {
        Row: {
          agent_email: string
          created_at: string
          id: string
          interaction_data: Json | null
          interaction_type: string
          ip_address: unknown | null
          trip_id: string
          user_agent: string | null
        }
        Insert: {
          agent_email: string
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          ip_address?: unknown | null
          trip_id: string
          user_agent?: string | null
        }
        Update: {
          agent_email?: string
          created_at?: string
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          ip_address?: unknown | null
          trip_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_interactions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "saved_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_trips: {
        Row: {
          ai_summary: string | null
          approximate_budget: number | null
          budget: number
          camref_links: string | null
          created_at: string
          description: string | null
          destination: string | null
          end_date: string | null
          enhanced_flights_url: string | null
          enhanced_hotels_url: string | null
          event_date: string | null
          event_dates: string | null
          event_name: string | null
          flights_url: string | null
          hotels_url: string | null
          id: string
          name: string
          start_date: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          approximate_budget?: number | null
          budget?: number
          camref_links?: string | null
          created_at?: string
          description?: string | null
          destination?: string | null
          end_date?: string | null
          enhanced_flights_url?: string | null
          enhanced_hotels_url?: string | null
          event_date?: string | null
          event_dates?: string | null
          event_name?: string | null
          flights_url?: string | null
          hotels_url?: string | null
          id?: string
          name: string
          start_date?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          approximate_budget?: number | null
          budget?: number
          camref_links?: string | null
          created_at?: string
          description?: string | null
          destination?: string | null
          end_date?: string | null
          enhanced_flights_url?: string | null
          enhanced_hotels_url?: string | null
          event_date?: string | null
          event_dates?: string | null
          event_name?: string | null
          flights_url?: string | null
          hotels_url?: string | null
          id?: string
          name?: string
          start_date?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      api_usage_tracking: {
        Row: {
          cost_per_call: number | null
          created_at: string | null
          endpoint: string
          id: string
          metadata: Json | null
          month_year: string
          provider: string
          total_cost: number | null
          usage_count: number
        }
        Insert: {
          cost_per_call?: number | null
          created_at?: string | null
          endpoint: string
          id?: string
          metadata?: Json | null
          month_year?: string
          provider: string
          total_cost?: number | null
          usage_count?: number
        }
        Update: {
          cost_per_call?: number | null
          created_at?: string | null
          endpoint?: string
          id?: string
          metadata?: Json | null
          month_year?: string
          provider?: string
          total_cost?: number | null
          usage_count?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          commission_amount: number | null
          commission_rate: number | null
          created_at: string | null
          details: Json | null
          id: string
          net_supplier_amount: number | null
          payment_method: string | null
          payment_processor: string | null
          payment_status: string | null
          payment_tracking_id: string | null
          status: string | null
          stripe_payment_id: string | null
          supplier_id: string | null
          supplier_paid: boolean | null
          total_price: number
          type: string | null
          user_id: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          details?: Json | null
          id?: string
          net_supplier_amount?: number | null
          payment_method?: string | null
          payment_processor?: string | null
          payment_status?: string | null
          payment_tracking_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          supplier_id?: string | null
          supplier_paid?: boolean | null
          total_price: number
          type?: string | null
          user_id?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          details?: Json | null
          id?: string
          net_supplier_amount?: number | null
          payment_method?: string | null
          payment_processor?: string | null
          payment_status?: string | null
          payment_tracking_id?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          supplier_id?: string | null
          supplier_paid?: boolean | null
          total_price?: number
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      buddy_requests: {
        Row: {
          created_at: string | null
          from_user_id: string | null
          id: string
          message: string | null
          status: string | null
          to_user_id: string | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buddy_requests_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buddy_requests_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buddy_requests_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      cached_images: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string | null
          height: number | null
          id: string
          image_id: string
          image_url: string
          original_source: string
          search_query: string
          thumbnail_url: string
          updated_at: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          category?: string
          created_at?: string | null
          height?: number | null
          id?: string
          image_id: string
          image_url: string
          original_source: string
          search_query: string
          thumbnail_url: string
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string | null
          height?: number | null
          id?: string
          image_id?: string
          image_url?: string
          original_source?: string
          search_query?: string
          thumbnail_url?: string
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      cached_itineraries: {
        Row: {
          id: string
          prompt: string
          response: string
          timestamp: string
        }
        Insert: {
          id?: string
          prompt: string
          response: string
          timestamp?: string
        }
        Update: {
          id?: string
          prompt?: string
          response?: string
          timestamp?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          budget: string | null
          context: Json | null
          created_at: string | null
          dates: string | null
          destination: string | null
          id: string
          last_activity_at: string | null
          session_id: string
          trip_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          budget?: string | null
          context?: Json | null
          created_at?: string | null
          dates?: string | null
          destination?: string | null
          id?: string
          last_activity_at?: string | null
          session_id: string
          trip_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          budget?: string | null
          context?: Json | null
          created_at?: string | null
          dates?: string | null
          destination?: string | null
          id?: string
          last_activity_at?: string | null
          session_id?: string
          trip_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      destination_activities: {
        Row: {
          category: string
          cost_range: string | null
          created_at: string
          description: string | null
          destination_id: string
          duration: string | null
          id: string
          image_url: string | null
          location: string | null
          tips: string | null
          title: string
        }
        Insert: {
          category: string
          cost_range?: string | null
          created_at?: string
          description?: string | null
          destination_id: string
          duration?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          tips?: string | null
          title: string
        }
        Update: {
          category?: string
          cost_range?: string | null
          created_at?: string
          description?: string | null
          destination_id?: string
          duration?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          tips?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_activities_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_attractions: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          destination_id: string
          id: string
          image_url: string | null
          name: string
          opening_hours: string | null
          price_range: string | null
          rating: number | null
          type: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          destination_id: string
          id?: string
          image_url?: string | null
          name: string
          opening_hours?: string | null
          price_range?: string | null
          rating?: number | null
          type?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          destination_id?: string
          id?: string
          image_url?: string | null
          name?: string
          opening_hours?: string | null
          price_range?: string | null
          rating?: number | null
          type?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destination_attractions_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          category: string | null
          created_at: string
          destination_id: string
          id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          destination_id: string
          id?: string
          sort_order?: number | null
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          destination_id?: string
          id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_images_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_tips: {
        Row: {
          category: string
          content: string
          created_at: string
          destination_id: string
          id: string
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          destination_id: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          destination_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_tips_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          average_cost_per_day: number | null
          best_time_to_visit: string | null
          category: string | null
          country: string
          created_at: string
          culture_overview: string | null
          currency: string | null
          description: string | null
          featured: boolean | null
          hero_image_url: string | null
          history: string | null
          id: string
          img: string | null
          keywords: string[] | null
          latitude: number | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          overview: string | null
          per: string | null
          price: number | null
          region: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          average_cost_per_day?: number | null
          best_time_to_visit?: string | null
          category?: string | null
          country: string
          created_at?: string
          culture_overview?: string | null
          currency?: string | null
          description?: string | null
          featured?: boolean | null
          hero_image_url?: string | null
          history?: string | null
          id?: string
          img?: string | null
          keywords?: string[] | null
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          overview?: string | null
          per?: string | null
          price?: number | null
          region?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          average_cost_per_day?: number | null
          best_time_to_visit?: string | null
          category?: string | null
          country?: string
          created_at?: string
          culture_overview?: string | null
          currency?: string | null
          description?: string | null
          featured?: boolean | null
          hero_image_url?: string | null
          history?: string | null
          id?: string
          img?: string | null
          keywords?: string[] | null
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          overview?: string | null
          per?: string | null
          price?: number | null
          region?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          joined_at: string | null
          looking_for_buddies: boolean | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          joined_at?: string | null
          looking_for_buddies?: boolean | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          joined_at?: string | null
          looking_for_buddies?: boolean | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          afternoon_activity: string | null
          afternoon_cost: number | null
          afternoon_description: string | null
          afternoon_duration: string | null
          created_at: string | null
          daily_total_cost: number | null
          date: string | null
          day_number: number
          evening_activity: string | null
          evening_cost: number | null
          evening_description: string | null
          evening_duration: string | null
          id: string
          morning_activity: string | null
          morning_cost: number | null
          morning_description: string | null
          morning_duration: string | null
          notes: string | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          afternoon_activity?: string | null
          afternoon_cost?: number | null
          afternoon_description?: string | null
          afternoon_duration?: string | null
          created_at?: string | null
          daily_total_cost?: number | null
          date?: string | null
          day_number: number
          evening_activity?: string | null
          evening_cost?: number | null
          evening_description?: string | null
          evening_duration?: string | null
          id?: string
          morning_activity?: string | null
          morning_cost?: number | null
          morning_description?: string | null
          morning_duration?: string | null
          notes?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          afternoon_activity?: string | null
          afternoon_cost?: number | null
          afternoon_description?: string | null
          afternoon_duration?: string | null
          created_at?: string | null
          daily_total_cost?: number | null
          date?: string | null
          day_number?: number
          evening_activity?: string | null
          evening_cost?: number | null
          evening_description?: string | null
          evening_duration?: string | null
          id?: string
          morning_activity?: string | null
          morning_cost?: number | null
          morning_description?: string | null
          morning_duration?: string | null
          notes?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      local_experts: {
        Row: {
          availability: Json | null
          created_at: string
          description: string
          destination_id: string
          expertise_areas: string[]
          hourly_rate: number | null
          id: string
          languages: string[] | null
          rating: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          availability?: Json | null
          created_at?: string
          description: string
          destination_id: string
          expertise_areas: string[]
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          availability?: Json | null
          created_at?: string
          description?: string
          destination_id?: string
          expertise_areas?: string[]
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "local_experts_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          common_interests: string[] | null
          created_at: string | null
          expires_at: string | null
          id: string
          match_score: number | null
          message: string | null
          status: string | null
          trip_id_1: string | null
          trip_id_2: string | null
          updated_at: string | null
          user_id_1: string | null
          user_id_2: string | null
        }
        Insert: {
          common_interests?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_score?: number | null
          message?: string | null
          status?: string | null
          trip_id_1?: string | null
          trip_id_2?: string | null
          updated_at?: string | null
          user_id_1?: string | null
          user_id_2?: string | null
        }
        Update: {
          common_interests?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_score?: number | null
          message?: string | null
          status?: string | null
          trip_id_1?: string | null
          trip_id_2?: string | null
          updated_at?: string | null
          user_id_1?: string | null
          user_id_2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_trip_id_1_fkey"
            columns: ["trip_id_1"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_trip_id_2_fkey"
            columns: ["trip_id_2"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          sender: string
          text: string
          timestamp: string
          user_id: string
        }
        Insert: {
          id?: string
          sender: string
          text: string
          timestamp?: string
          user_id: string
        }
        Update: {
          id?: string
          sender?: string
          text?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      monthly_api_limits: {
        Row: {
          cost_per_call: number | null
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          monthly_limit: number
          provider: string
          reset_day: number | null
          updated_at: string | null
        }
        Insert: {
          cost_per_call?: number | null
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          monthly_limit: number
          provider: string
          reset_day?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_per_call?: number | null
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          monthly_limit?: number
          provider?: string
          reset_day?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_features: {
        Row: {
          created_at: string
          description: string | null
          feature_limit: number | null
          feature_name: string
          id: string
          plan_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_limit?: number | null
          feature_name: string
          id?: string
          plan_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_limit?: number | null
          feature_name?: string
          id?: string
          plan_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          username?: string
        }
        Relationships: []
      }
      saved_itineraries: {
        Row: {
          id: string
          notes: string | null
          saved_at: string | null
          trip_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          saved_at?: string | null
          trip_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          saved_at?: string | null
          trip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_itineraries_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_itineraries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_trips: {
        Row: {
          agent_email: string | null
          agent_emails: string[] | null
          agent_message: string | null
          agent_template_type: string | null
          created_at: string
          destination: string | null
          follow_up_sent_at: string | null
          id: string
          image_url: string | null
          is_favorite: boolean | null
          is_public: boolean | null
          share_id: string | null
          shared_with_agent_at: string | null
          summary: string | null
          trip_data: Json
          trip_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_email?: string | null
          agent_emails?: string[] | null
          agent_message?: string | null
          agent_template_type?: string | null
          created_at?: string
          destination?: string | null
          follow_up_sent_at?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          is_public?: boolean | null
          share_id?: string | null
          shared_with_agent_at?: string | null
          summary?: string | null
          trip_data: Json
          trip_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_email?: string | null
          agent_emails?: string[] | null
          agent_message?: string | null
          agent_template_type?: string | null
          created_at?: string
          destination?: string | null
          follow_up_sent_at?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          is_public?: boolean | null
          share_id?: string | null
          shared_with_agent_at?: string | null
          summary?: string | null
          trip_data?: Json
          trip_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          check_in_date: string | null
          check_out_date: string | null
          created_at: string
          destination: string
          dropoff_date: string | null
          guests: number | null
          id: string
          pickup_date: string | null
          rooms: number | null
          search_data: Json | null
          search_type: string
          travelers: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          destination: string
          dropoff_date?: string | null
          guests?: number | null
          id?: string
          pickup_date?: string | null
          rooms?: number | null
          search_data?: Json | null
          search_type: string
          travelers?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          destination?: string
          dropoff_date?: string | null
          guests?: number | null
          id?: string
          pickup_date?: string | null
          rooms?: number | null
          search_data?: Json | null
          search_type?: string
          travelers?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      shared_wishlists: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_wishlists_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string | null
          excerpt: string | null
          id: number
          image: string | null
          link: string
          published_at: string | null
          source: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          excerpt?: string | null
          id?: number
          image?: string | null
          link: string
          published_at?: string | null
          source?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          excerpt?: string | null
          id?: number
          image?: string | null
          link?: string
          published_at?: string | null
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      story_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          story_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          story_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          story_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "story_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_comments_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "travel_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_likes: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_likes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "travel_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          created_at: string | null
          default_commission_rate: number | null
          id: string
          name: string
          payment_method: string | null
        }
        Insert: {
          created_at?: string | null
          default_commission_rate?: number | null
          id?: string
          name: string
          payment_method?: string | null
        }
        Update: {
          created_at?: string | null
          default_commission_rate?: number | null
          id?: string
          name?: string
          payment_method?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          booking_id: string | null
          created_at: string | null
          id: string
          stripe_event_id: string | null
          type: string | null
        }
        Insert: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          stripe_event_id?: string | null
          type?: string | null
        }
        Update: {
          amount?: number | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          stripe_event_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_buddy_matches: {
        Row: {
          id: string
          last_message_at: string | null
          matched_on: string | null
          status: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          id?: string
          last_message_at?: string | null
          matched_on?: string | null
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          id?: string
          last_message_at?: string | null
          matched_on?: string | null
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_buddy_matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_buddy_matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_buddy_notifications: {
        Row: {
          content: string | null
          created_at: string | null
          event_id: string | null
          id: string
          is_read: boolean | null
          match_id: string | null
          sender_id: string | null
          trip_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          match_id?: string | null
          sender_id?: string | null
          trip_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_read?: boolean | null
          match_id?: string | null
          sender_id?: string | null
          trip_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_buddy_notifications_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "travel_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_buddy_notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_buddy_notifications_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_buddy_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_chat: {
        Row: {
          created_at: string
          id: string
          message: string
          pinned: boolean | null
          reactions: Json | null
          receiver_id: string
          sender_id: string
          sent_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          pinned?: boolean | null
          reactions?: Json | null
          receiver_id: string
          sender_id: string
          sent_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          pinned?: boolean | null
          reactions?: Json | null
          receiver_id?: string
          sender_id?: string
          sent_at?: string
        }
        Relationships: []
      }
      travel_matches: {
        Row: {
          created_at: string | null
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_preferences: {
        Row: {
          accessibility_needs: string[] | null
          accommodation_type: string[] | null
          budget_range_max: number | null
          budget_range_min: number | null
          created_at: string | null
          dietary_restrictions: string[] | null
          group_size_preference: string | null
          id: string
          preferred_activities: string[] | null
          travel_pace: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accessibility_needs?: string[] | null
          accommodation_type?: string[] | null
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          group_size_preference?: string | null
          id?: string
          preferred_activities?: string[] | null
          travel_pace?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accessibility_needs?: string[] | null
          accommodation_type?: string[] | null
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          group_size_preference?: string | null
          id?: string
          preferred_activities?: string[] | null
          travel_pace?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_stories: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          destination_id: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          is_public: boolean | null
          latitude: number | null
          likes_count: number | null
          location: string | null
          longitude: number | null
          title: string
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          destination_id?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          latitude?: number | null
          likes_count?: number | null
          location?: string | null
          longitude?: number | null
          title: string
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          destination_id?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          latitude?: number | null
          likes_count?: number | null
          location?: string | null
          longitude?: number | null
          title?: string
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_stories_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_stories_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_swipes: {
        Row: {
          created_at: string | null
          id: string
          liked: boolean
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked: boolean
          swiped_id: string
          swiper_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked?: boolean
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_swipes_swiped_id_fkey"
            columns: ["swiped_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travel_swipes_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_participants: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          trip_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          trip_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          trip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_participants_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_recommendations: {
        Row: {
          accommodation_type: string | null
          activities: string[] | null
          based_on_preferences: Json | null
          best_time_to_visit: string | null
          confidence_score: number | null
          created_at: string
          description: string | null
          destination: string
          duration_days: number | null
          estimated_budget: number | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_saved: boolean | null
          is_viewed: boolean | null
          local_insights: string | null
          recommendation_type: string
          title: string
          transport_suggestions: string[] | null
          user_id: string
        }
        Insert: {
          accommodation_type?: string | null
          activities?: string[] | null
          based_on_preferences?: Json | null
          best_time_to_visit?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          destination: string
          duration_days?: number | null
          estimated_budget?: number | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_saved?: boolean | null
          is_viewed?: boolean | null
          local_insights?: string | null
          recommendation_type?: string
          title: string
          transport_suggestions?: string[] | null
          user_id: string
        }
        Update: {
          accommodation_type?: string | null
          activities?: string[] | null
          based_on_preferences?: Json | null
          best_time_to_visit?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          destination?: string
          duration_days?: number | null
          estimated_budget?: number | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_saved?: boolean | null
          is_viewed?: boolean | null
          local_insights?: string | null
          recommendation_type?: string
          title?: string
          transport_suggestions?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      trip_shares: {
        Row: {
          id: string
          platform: string
          shared_at: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          id?: string
          platform: string
          shared_at?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          id?: string
          platform?: string
          shared_at?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_shares_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          ai_generated: boolean | null
          ai_prompt: string | null
          budget: number | null
          country: string | null
          created_at: string | null
          currency: string | null
          destination: string
          duration_days: number | null
          end_date: string | null
          id: string
          itinerary_json: Json | null
          looking_for_buddies: boolean | null
          max_buddies: number | null
          public: boolean | null
          start_date: string | null
          status: string | null
          title: string
          trip_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_prompt?: string | null
          budget?: number | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          destination: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          itinerary_json?: Json | null
          looking_for_buddies?: boolean | null
          max_buddies?: number | null
          public?: boolean | null
          start_date?: string | null
          status?: string | null
          title: string
          trip_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_prompt?: string | null
          budget?: number | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          destination?: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          itinerary_json?: Json | null
          looking_for_buddies?: boolean | null
          max_buddies?: number | null
          public?: boolean | null
          start_date?: string | null
          status?: string | null
          title?: string
          trip_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_alerts: {
        Row: {
          alert_email: string
          created_at: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          last_alert_sent: string | null
          provider: string
          threshold_percentage: number
        }
        Insert: {
          alert_email?: string
          created_at?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          provider: string
          threshold_percentage?: number
        }
        Update: {
          alert_email?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          last_alert_sent?: string | null
          provider?: string
          threshold_percentage?: number
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_behavior_tracking: {
        Row: {
          event_data: Json
          event_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_data: Json
          event_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_conversations: {
        Row: {
          created_at: string
          extracted_info: Json
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          extracted_info?: Json
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          extracted_info?: Json
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feature_usage: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          last_used: string | null
          reset_date: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          last_used?: string | null
          reset_date?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          last_used?: string | null
          reset_date?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          confidence_score: number
          expires_at: string
          generated_at: string
          id: string
          is_active: boolean
          recommendation_data: Json
          recommendation_type: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number
          expires_at?: string
          generated_at?: string
          id?: string
          is_active?: boolean
          recommendation_data: Json
          recommendation_type: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number
          expires_at?: string
          generated_at?: string
          id?: string
          is_active?: boolean
          recommendation_data?: Json
          recommendation_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number | null
          agoda_affiliate_id: string | null
          bio: string | null
          booking_affiliate_id: string | null
          created_at: string | null
          email: string
          expedia_affiliate_id: string | null
          hotels_affiliate_id: string | null
          id: string
          interests: string[] | null
          kayak_affiliate_id: string | null
          languages_spoken: string[] | null
          location: string | null
          preferred_destinations: string[] | null
          priceline_affiliate_id: string | null
          profile_photo_url: string | null
          public_profile: boolean | null
          stripe_customer_id: string | null
          subscription_status: string | null
          travel_style: string | null
          verified: boolean | null
        }
        Insert: {
          age?: number | null
          agoda_affiliate_id?: string | null
          bio?: string | null
          booking_affiliate_id?: string | null
          created_at?: string | null
          email: string
          expedia_affiliate_id?: string | null
          hotels_affiliate_id?: string | null
          id?: string
          interests?: string[] | null
          kayak_affiliate_id?: string | null
          languages_spoken?: string[] | null
          location?: string | null
          preferred_destinations?: string[] | null
          priceline_affiliate_id?: string | null
          profile_photo_url?: string | null
          public_profile?: boolean | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          travel_style?: string | null
          verified?: boolean | null
        }
        Update: {
          age?: number | null
          agoda_affiliate_id?: string | null
          bio?: string | null
          booking_affiliate_id?: string | null
          created_at?: string | null
          email?: string
          expedia_affiliate_id?: string | null
          hotels_affiliate_id?: string | null
          id?: string
          interests?: string[] | null
          kayak_affiliate_id?: string | null
          languages_spoken?: string[] | null
          location?: string | null
          preferred_destinations?: string[] | null
          priceline_affiliate_id?: string | null
          profile_photo_url?: string | null
          public_profile?: boolean | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          travel_style?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_by: string
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          price: number | null
          title: string
          url: string | null
          votes_count: number | null
          wishlist_id: string
        }
        Insert: {
          added_by: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          title: string
          url?: string | null
          votes_count?: number | null
          wishlist_id: string
        }
        Update: {
          added_by?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          title?: string
          url?: string | null
          votes_count?: number | null
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "shared_wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      booking_trends: {
        Row: {
          bookings_count: number | null
          car_bookings: number | null
          daily_commissions: number | null
          daily_revenue: number | null
          date: string | null
          flight_bookings: number | null
          hotel_bookings: number | null
          package_bookings: number | null
        }
        Relationships: []
      }
      commission_analytics: {
        Row: {
          avg_booking_value: number | null
          avg_commission_rate: number | null
          commissions_earned: number | null
          effective_commission_rate: number | null
          gross_revenue: number | null
          total_bookings: number | null
          type: string | null
        }
        Relationships: []
      }
      recent_transactions: {
        Row: {
          amount: number | null
          booking_amount: number | null
          booking_type: string | null
          created_at: string | null
          customer_email: string | null
          id: string | null
          supplier_name: string | null
          type: string | null
        }
        Relationships: []
      }
      revenue_summary: {
        Row: {
          avg_commission_rate: number | null
          commissions_earned: number | null
          effective_commission_rate: number | null
          gross_revenue: number | null
          month: string | null
          supplier_payouts: number | null
          total_bookings: number | null
        }
        Relationships: []
      }
      supplier_performance: {
        Row: {
          amount_owed: number | null
          amount_paid: number | null
          amount_pending: number | null
          avg_commission_rate: number | null
          commissions_earned: number | null
          gross_revenue: number | null
          id: string | null
          name: string | null
          total_bookings: number | null
        }
        Relationships: []
      }
      travel_buddy_pairings: {
        Row: {
          days_since_match: number | null
          last_message_at: string | null
          match_id: string | null
          matched_on: string | null
          status: string | null
          user1_age: number | null
          user1_email: string | null
          user1_location: string | null
          user1_photo: string | null
          user2_age: number | null
          user2_email: string | null
          user2_location: string | null
          user2_photo: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_advanced_match_score: {
        Args: { user1_id: string; user2_id: string }
        Returns: Json
      }
      calculate_match_score: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      clean_old_cached_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_recommendations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_chat_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      find_enhanced_travel_buddies: {
        Args: {
          user_id: string
          destination_filter?: string
          max_age_diff?: number
          min_score?: number
          limit_count?: number
        }
        Returns: {
          buddy_user_id: string
          buddy_email: string
          buddy_age: number
          buddy_location: string
          buddy_photo: string
          buddy_bio: string
          buddy_travel_style: string
          buddy_languages: string[]
          match_score: number
          score_breakdown: Json
          common_interests: string[]
          common_destinations: string[]
        }[]
      }
      find_travel_buddies: {
        Args: { user_trip_id: string }
        Returns: {
          buddy_user_id: string
          buddy_trip_id: string
          buddy_name: string
          buddy_destination: string
          match_score: number
          common_dates: number
        }[]
      }
      generate_trip_recommendations: {
        Args: { target_user_id: string }
        Returns: {
          destination: string
          title: string
          description: string
          confidence_score: number
          estimated_budget: number
          duration_days: number
          activities: string[]
          recommendation_reason: string
        }[]
      }
      get_follower_count: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_following_count: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_monthly_usage_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          provider: string
          endpoint: string
          current_usage: number
          monthly_limit: number
          usage_percentage: number
          remaining_calls: number
          total_cost: number
        }[]
      }
      get_potential_travel_buddies: {
        Args:
          | { current_user_id: string; limit_count?: number }
          | { user_id: string }
        Returns: {
          user_id: string
          user_email: string
          user_age: number
          user_bio: string
          user_location: string
          user_photo: string
          preferred_destinations: string[]
          travel_style: string
          interests: string[]
          compatibility_score: number
        }[]
      }
      get_recent_notifications: {
        Args: { user_id: string; limit_count?: number }
        Returns: {
          id: string
          sender_username: string
          sender_avatar: string
          notification_type: string
          content: string
          is_read: boolean
          match_id: string
          created_at: string
        }[]
      }
      get_unread_notification_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_behavior_patterns: {
        Args: { p_user_id: string; p_days_back?: number }
        Returns: {
          search_patterns: Json
          destination_interests: Json
          activity_preferences: Json
          budget_range: Json
          trip_duration_preference: Json
        }[]
      }
      get_user_matches: {
        Args: { user_email: string } | { user_id: string }
        Returns: {
          match_id: string
          matched_user_email: string
          matched_user_photo: string
          matched_user_location: string
          matched_user_age: number
          matched_on: string
          days_since_match: number
        }[]
      }
      has_premium_access: {
        Args: { user_id: string; feature_name: string }
        Returns: boolean
      }
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      mark_notifications_as_read: {
        Args: { notification_ids: string[] }
        Returns: undefined
      }
      record_swipe: {
        Args:
          | {
              current_user_email: string
              target_user_id: string
              is_like: boolean
            }
          | {
              swiper_user_id: string
              swiped_user_id: string
              is_liked: boolean
            }
        Returns: Json
      }
      track_api_call: {
        Args: {
          p_provider: string
          p_endpoint: string
          p_usage_count?: number
          p_metadata?: Json
        }
        Returns: undefined
      }
      track_feature_usage: {
        Args: { user_id: string; feature_name: string }
        Returns: boolean
      }
      track_user_behavior: {
        Args: {
          p_user_id: string
          p_session_id: string
          p_event_type: string
          p_event_data: Json
          p_page_url?: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
