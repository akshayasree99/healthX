import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and anon key
const SUPABASE_URL = 'https://hpwxzwgukgdosbawvvxl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3h6d2d1a2dkb3NiYXd2dnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDA4MDUsImV4cCI6MjA1NzY3NjgwNX0.Wp-d5CaLVHOBc5o2MJfTuArPl4UKE3AvrJkwKDHTock';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export  {supabase};
