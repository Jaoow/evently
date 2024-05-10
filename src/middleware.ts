import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();
// TODO: Implement middleware

export const config = {
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
