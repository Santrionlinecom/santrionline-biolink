import { redirect, type Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'so_biolink_admin';

async function sha256(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function expectedSession(platform: App.Platform | undefined): Promise<string> {
  const secret = platform?.env?.ADMIN_SESSION_SECRET || platform?.env?.ADMIN_PASSWORD || 'dev-only-change-me';
  return sha256(`santrionline-biolink:${secret}`);
}

export async function isAdmin(cookies: Cookies, platform: App.Platform | undefined): Promise<boolean> {
  const value = cookies.get(COOKIE_NAME);
  if (!value) return false;
  return value === (await expectedSession(platform));
}

export async function requireAdmin(cookies: Cookies, platform: App.Platform | undefined) {
  if (!(await isAdmin(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }
}

export async function login(cookies: Cookies, platform: App.Platform | undefined, password: string) {
  const expectedPassword = platform?.env?.ADMIN_PASSWORD || 'admin12345';
  if (password !== expectedPassword) return false;
  cookies.set(COOKIE_NAME, await expectedSession(platform), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14
  });
  return true;
}

export function logout(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, { path: '/' });
}
