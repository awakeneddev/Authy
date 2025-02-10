import dbConnect from "@/lib/db";
import User from "@/models/register";
import { errorResponse, successResponse } from "@/utils/api/responseUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("Invalid Credentials", "Retry", 401);
    }

    if (user) {
      // checking password
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        errorResponse("Invalid Credentials", "Retry", 401);
      }

      // generating token
      const token = jwt.sign(
        { userId: user.id, username: user.email },
        secret as string,
        { expiresIn: "1h" }
      );

      const cookieStore = await cookies();

      cookieStore.set({
        name: "Authy",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 1000,
      });

      return successResponse("Logged in successfully", "Welcome Back", 201);
    }
  } catch (error) {
    return errorResponse("Internal Server Error", error, 501);
  }
}
