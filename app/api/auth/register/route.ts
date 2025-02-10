import dbConnect from "@/lib/db";
import User from "@/models/register";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { name, email, password, confirmPassword } = await req.json();

  if (password !== confirmPassword)
    return NextResponse.json({ status: 401,message: "Password didn't match" });

  try {
    // Ensuring bcrypt receives valid parameters
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
 
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ message: "Email already exists" });
    }

    // new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "New user registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({
      status: 501,
      message: "Internal Server Error",
      error: (err as Error).message,
    });
  }
}
