import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = 'https://diwopcqhbzvlfzohokts.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('All environment variables:', process.env);
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

// let supabase;
// try {
//   if (!supabaseKey) {
//     throw new Error('Supabase key is undefined. Check your .env file.');
//   }
//   supabase = createClient(supabaseUrl, supabaseKey);
//   console.log('Supabase client created successfully');
// } catch (error) {
//   console.error('Error creating Supabase client:', error);
// }

// export default supabase;
