/**
 * An array of routes that are accessivle to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/search, /series/[id]"];

export const privateRoutes = ["/settings"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ["/login", "/reset-password", "/error"];

export const adminRoute = "/admin";
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
export const DEFAULT_LOGIN_REDIRECT = "/";
