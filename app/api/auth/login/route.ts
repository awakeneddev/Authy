import dbConnect from "@/lib/db";
import User from "@/models/register";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      NextResponse.json({
        status: 401,
        message: "Invalid Credentials",
      });
    }

    if (user) {
      // checking password
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        NextResponse.json({
          status: 401,
          message: "Invalid Credentials",
        });
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

      return NextResponse.json({
        status: 200,
        message: "User login successfully",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
}
