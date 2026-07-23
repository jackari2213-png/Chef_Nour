import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
    return (
        process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder-project.supabase.co' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
    );
}
