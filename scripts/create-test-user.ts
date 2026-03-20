import { createClient } from '@insforge/sdk';
import dotenv from 'dotenv';
dotenv.config();

async function createTestUser() {
  const insforge = createClient({
    baseUrl: process.env.VITE_INSFORGE_BASE_URL || '',
    anonKey: process.env.VITE_INSFORGE_ANON_KEY || ''
  });

  console.log('Creating test user...');
  const email = 'testuser@example.com';
  const password = 'Password123!';

  const { data, error } = await insforge.auth.signUp({
    email,
    password,
    name: 'Test User'
  });

  if (error) {
    console.error('Error creating user:', error);
    if (error.message.includes('already exists')) {
      console.log('User already exists. You can use these credentials.');
    }
  } else {
    console.log('User created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    if (data?.requireEmailVerification) {
      console.log('⚠️ NOTE: Email verification is REQUIRED for this backend.');
    } else {
      console.log('✅ User is ready to log in.');
    }
  }
}

createTestUser();
