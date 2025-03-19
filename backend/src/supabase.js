// frontend/src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpwxzwgukgdosbawvvxl.supabase.co';
const supabaseAnonKey = 'hpwxzwgukgdosbawvvxl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);