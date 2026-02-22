// Placeholder database types.
// Replace with generated types by running:
//   npx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          type: "video" | "text" | "article" | "voice";
          title: string | null;
          body: string | null;
          video_url: string | null;
          audio_url: string | null;
          author_id: string;
          author_name: string | null;
          author_avatar_url: string | null;
          tag: "love" | "health" | "magic" | "ask";
          comments_enabled: boolean;
          anonymous_question: string | null;
          pinned: boolean;
          pinned_at: string | null;
          file_url: string | null;
          file_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: "video" | "text" | "article" | "voice";
          title?: string | null;
          body?: string | null;
          video_url?: string | null;
          audio_url?: string | null;
          author_id: string;
          author_name?: string | null;
          author_avatar_url?: string | null;
          tag: "love" | "health" | "magic" | "ask";
          comments_enabled?: boolean;
          anonymous_question?: string | null;
          pinned?: boolean;
          pinned_at?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: "video" | "text" | "article" | "voice";
          title?: string | null;
          body?: string | null;
          video_url?: string | null;
          audio_url?: string | null;
          author_id?: string;
          author_name?: string | null;
          author_avatar_url?: string | null;
          tag?: "love" | "health" | "magic";
          comments_enabled?: boolean;
          anonymous_question?: string | null;
          pinned?: boolean;
          pinned_at?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          status: "active" | "past_due" | "canceled" | "unpaid" | "inactive";
          current_period_end: string | null;
          telegram_user_id: string | null;
          terms_accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          status?: "active" | "past_due" | "canceled" | "unpaid" | "inactive";
          current_period_end?: string | null;
          telegram_user_id?: string | null;
          terms_accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          status?: "active" | "past_due" | "canceled" | "unpaid" | "inactive";
          current_period_end?: string | null;
          telegram_user_id?: string | null;
          terms_accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          author_name: string | null;
          author_avatar_url: string | null;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          author_name?: string | null;
          author_avatar_url?: string | null;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          author_name?: string | null;
          author_avatar_url?: string | null;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          sender_name: string | null;
          sender_avatar_url: string | null;
          body: string;
          reply_body: string | null;
          status: "unread" | "read" | "addressed";
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          sender_name?: string | null;
          sender_avatar_url?: string | null;
          body: string;
          reply_body?: string | null;
          status?: "unread" | "read" | "addressed";
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          sender_name?: string | null;
          sender_avatar_url?: string | null;
          body?: string;
          reply_body?: string | null;
          status?: "unread" | "read" | "addressed";
          created_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_handles: {
        Row: {
          user_id: string;
          handle: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          handle: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          handle?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          actor_id: string;
          actor_name: string | null;
          actor_avatar_url: string | null;
          resource_type: string | null;
          resource_id: string | null;
          body_preview: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          actor_id: string;
          actor_name?: string | null;
          actor_avatar_url?: string | null;
          resource_type?: string | null;
          resource_id?: string | null;
          body_preview?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          actor_id?: string;
          actor_name?: string | null;
          actor_avatar_url?: string | null;
          resource_type?: string | null;
          resource_id?: string | null;
          body_preview?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
