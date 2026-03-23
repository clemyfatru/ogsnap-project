import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vxcmxucrcjfvjrqyohuw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4Y214dWNyY2pmdmpycXlvaHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NDAyNDAsImV4cCI6MjA4MzMxNjI0MH0.76qfu5jw2rdPLvcLaBDxDRY-3W8iZlSRsWshdOZJjT8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
