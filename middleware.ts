import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // protège toutes les routes sauf assets
    "/",                      // protège la home
    "/(api|trpc)(.*)",        // protège les API
  ],
};
