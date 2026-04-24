import { createClient } from '@supabase/supabase-client'

// ==========================================
// KUNCI KHUSUS DATABASE DEMO
// AMAN 100% DARI DATABASE ASLI PONCOKUSUMO
// ==========================================
const supabaseUrl = 'https://bfcbjfbzraylsqudcqaw.supabase.co' 
const supabaseAnonKey = 'sb_publishable_R4yRrQJSe047pyeV3V3upw_bzh7UZge'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)