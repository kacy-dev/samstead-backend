// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://egajntwinfinzgfgrriy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWpudHdpbmZpbnpnZmdycml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5ODQ4NDYsImV4cCI6MjA1OTU2MDg0Nn0.6lvn2nyfUo_6PYngHP0GfjL7Z02B_2-oycmhoG6vZbs';

export const supabase = createClient(supabaseUrl, supabaseKey);