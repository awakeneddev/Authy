// app/api/auth/logout/route.ts
import { successResponse } from "@/utils/api/responseUtils";
import { cookies } from "next/headers";

export async function POST() {
  // Remove the JWT cookie
  const cookieStore = await cookies();

  cookieStore.delete("Authy");

  return successResponse("logout successfully", "Logout", 201);
}
