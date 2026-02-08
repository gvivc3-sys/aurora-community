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
      videos: {
        Row: {
          id: string;
          title: string;
          vimeo_url: string;
          author_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          vimeo_url: string;
          author_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          vimeo_url?: string;
          author_id?: string;
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
