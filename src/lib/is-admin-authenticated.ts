import { env } from "@/env";

const isValidAdminPassword = async (
  password: string,
  hashedPassword: string,
) => {
  return (await hashPassword(password)) === hashedPassword;
};

const hashPassword = async (password: string) => {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password),
  );

  return Buffer.from(arrayBuffer).toString("base64");
};

export const isAdminAuthenticated = async (authHeader: string | null) => {
  if (!authHeader) return false;

  const [username, password] = Buffer.from(
    authHeader.split(" ")[1] as string,
    "base64",
  )
    .toString()
    .split(":");

  return (
    username === env.ADMIN_USERNAME &&
    (await isValidAdminPassword(password as string, env.ADMIN_HASHED_PASSWORD))
  );
};
