import dbConnect from "@/lib/db";
import User from "@/models/register";
import { errorResponse, successResponse } from "@/utils/api/responseUtils";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { name, email, password, confirmPassword } = await req.json();

  if (password !== confirmPassword)
    return errorResponse("Password not match", "Invalid Credentials", 400);

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return errorResponse("Email Already Exists", "Duplicate", 409);
    }
    // Ensuring bcrypt receives valid parameters
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return successResponse("New User created successfully", `${name}`, 201);
  } catch (err) {
    return errorResponse("Internal Server Error", err, 501);
  }
}
