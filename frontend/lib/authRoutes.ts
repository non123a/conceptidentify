export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

export const GUEST_ONLY_PATHS = [
  "/login",
  "/register",
];

export const AUTHENTICATED_PATH_PREFIXES = [
  "/dashboard",
  "/profile",
  "/courses",
  "/upload",
];

export const LAST_AUTHENTICATED_PATH_KEY =
  "conceptIdentify.lastAuthenticatedPath";

export function isGuestOnlyPath(pathname: string) {
  return GUEST_ONLY_PATHS.includes(pathname);
}

export function isAuthenticatedAppPath(pathname: string) {
  return AUTHENTICATED_PATH_PREFIXES.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getAuthenticatedRedirectPath(
  lastAuthenticatedPath: string | null
) {
  if (
    lastAuthenticatedPath &&
    isAuthenticatedAppPath(lastAuthenticatedPath)
  ) {
    return lastAuthenticatedPath;
  }

  return DEFAULT_AUTHENTICATED_PATH;
}
