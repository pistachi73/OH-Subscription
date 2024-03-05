/**
 * An array of routes that are accessivle to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset-password",
];

/**
 * The prefix for the API authetication routes
 * Routes that start with this prefix are used for API autheintication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The defaultedirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
