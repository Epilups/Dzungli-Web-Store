import { json } from '@sveltejs/kit';
import { getUserFromRequest } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const user = await getUserFromRequest(event);
  
  if (!user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  return json({ user });
};