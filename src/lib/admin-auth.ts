import { cookies } from "next/headers";

const COOKIE_NAME = "sci_admin_session";

export function validateCredentials(username: string, password: string): boolean {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export function createSessionToken(username: string): string {
  const payload = JSON.stringify({ username, ts: Date.now() });
  return Buffer.from(payload).toString("base64");
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return false;

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return decoded.username === process.env.ADMIN_USERNAME;
  } catch {
    return false;
  }
}
