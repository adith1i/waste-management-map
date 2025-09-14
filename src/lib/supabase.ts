import { createClient } from '@supabase/supabase-js'

// Supabase client configuration with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client instance for database operations and storage
 * Configured with public URL and anonymous key for client-side usage
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
