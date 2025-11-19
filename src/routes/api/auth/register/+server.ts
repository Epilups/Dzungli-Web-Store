import { json } from '@sveltejs/kit';
import { registerUser } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await registerUser(email, password, firstName, lastName);

    if ('error' in result) {
      return json({ error: result.error }, { status: 400 });
    }

    return json(
      {
        user: result.user,
        message: 'Registration successful'
      },
      {
        status: 201,
        headers: {
          'Set-Cookie': `auth_token=${result.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};