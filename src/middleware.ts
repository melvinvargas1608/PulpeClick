import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies } = context;

  // Only protect /admin routes, exclude login and logout pages
  if (
    url.pathname.startsWith('/admin') &&
    url.pathname !== '/admin/login' &&
    url.pathname !== '/admin/logout'
  ) {
    const sessionCookie = cookies.get('admin_session')?.value;

    if (!sessionCookie || !verifySessionToken(sessionCookie)) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/admin/login' },
      });
    }
  }

  return next();
});
