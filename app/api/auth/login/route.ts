import dbConnect from "@/lib/db";
import User from "@/models/register";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

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
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        NextResponse.json({
          status: 401,
          message: "Invalid Credentials",
        });
      }

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
