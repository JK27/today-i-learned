import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://hzzoczkjeszfdsjlptsf.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6em9jemtqZXN6ZmRzamxwdHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2NjYzNTcsImV4cCI6MTk5MDI0MjM1N30._f1s3OZRSuD2GmI3WOKSCI9kIYkJ8NRlbPF_BpDI7lE"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase