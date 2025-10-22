console.log("supabase-client.js loaded");
const SUPABASE_URL = 'https://swsyvokuthjvgmezeodv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c3l2b2t1dGhqdmdtZXplb2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDQxOTUsImV4cCI6MjA3NjcyMDE5NX0.-y-nVO34LnPpjIDkiqjQWHk0AiqsZWPKJKOWb4UYaVw';

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
