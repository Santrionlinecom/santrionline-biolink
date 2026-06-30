import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdmin, login } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (await isAdmin(cookies, platform)) throw redirect(303, '/admin');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, platform }) => {
    const form = await request.formData();
    const password = String(form.get('password') ?? '');
    const ok = await login(cookies, platform, password);
    if (!ok) return fail(401, { message: 'Password admin salah.' });
    throw redirect(303, '/admin');
  }
};
