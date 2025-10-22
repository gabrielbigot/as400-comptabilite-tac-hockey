// ============================================
// Configuration Supabase Client
// ============================================
// Ce fichier est un TEMPLATE
//
// INSTRUCTIONS :
// 1. Créez votre projet sur https://supabase.com
// 2. Récupérez vos credentials (Settings > API)
// 3. Remplacez les valeurs ci-dessous
// 4. Renommez ce fichier en "supabase-client.js"
//    OU copiez le contenu dans le fichier supabase-client.js existant
// ============================================

console.log("supabase-client.js loaded");

// ============================================
// CREDENTIALS À MODIFIER
// ============================================
// Remplacez par votre URL de projet Supabase
// Format: https://VOTRE-PROJECT-ID.supabase.co
const SUPABASE_URL = 'REMPLACEZ-PAR-VOTRE-URL-ICI';

// Remplacez par votre clé API publique (anon key)
// ATTENTION: Utilisez la clé "anon public", PAS la "service_role" !
const SUPABASE_ANON_KEY = 'REMPLACEZ-PAR-VOTRE-CLE-ANON-ICI';

// ============================================
// NE PAS MODIFIER CETTE LIGNE
// ============================================
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// EXEMPLE DE CONFIGURATION
// ============================================
// Voici à quoi ressemblent des credentials réelles :
//
// const SUPABASE_URL = 'https://abcdefghijklmnopqrst.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4MTI5OTYsImV4cCI6MTk5OTM4ODk5Nn0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// ============================================
