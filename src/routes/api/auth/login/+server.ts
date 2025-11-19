import { json } from '@sveltejs/kit';
import { loginUser } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await loginUser(email, password);

    if ('error' in result) {
      return json({ error: result.error }, { status: 401 });
    }

    return json(
      {
        user: result.user,
        message: 'Login successful'
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `auth_token=${result.token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};