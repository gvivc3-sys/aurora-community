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
          type: "video" | "text" | "article";
          title: string | null;
          body: string | null;
          video_url: string | null;
          author_id: string;
          author_name: string | null;
          author_avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: "video" | "text" | "article";
          title?: string | null;
          body?: string | null;
          video_url?: string | null;
          author_id: string;
          author_name?: string | null;
          author_avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: "video" | "text" | "article";
          title?: string | null;
          body?: string | null;
          video_url?: string | null;
          author_id?: string;
          author_name?: string | null;
          author_avatar_url?: string | null;
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
