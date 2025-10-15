const dotenv = require('dotenv');
dotenv.config(); // load .env first

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY // use service role key on server
);

module.exports = { supabase };
