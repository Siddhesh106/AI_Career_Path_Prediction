import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lhktbabwrnjinnfhdelb.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3RiYWJ3cm5qaW5uZmhkZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTE2NjQsImV4cCI6MjA5MzcyNzY2NH0.Pdy8iaY_RiHNg5FNG2T-dBR0sY5M_OqRUWxqVvNRjTQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const email = 'test_auth_2@example.com';
  const password = 'password123';

  console.log(`Attempting to sign in ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    return;
  }

  console.log('Sign in successful!');
  if (data.session) {
      console.log('Session token length:', data.session.access_token.length);
  } else {
      console.log('No session created.');
  }
}

main();
