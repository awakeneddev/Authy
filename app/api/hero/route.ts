import dbConnect from "@/lib/db";
import Hero from "@/models/hero";
import { errorResponse, successResponse } from "@/utils/api/responseUtils";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]; // Allowed MIME types for images

export async function GET() {
  await dbConnect();
  try {
    const response = await Hero.find();
    return successResponse("Hero section fetched successfully.", response);
  } catch (err) {
    return errorResponse((err as Error).message, err, 500);
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();

  try {
    // assuming image key in body
    const file = formData.get("image") as File;
    if (!file) {
      return errorResponse("Please select file.", formData);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("Image size must be less than 5MB.", "limit", 409);
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return errorResponse(
        "Invalid image type. Only JPEG, PNG, and WebP are allowed.",
        "File Type",
        409
      );
    }

    // parsing to raw binary presentation
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replace(/\s+/g, "_");

    // Save file
    const uploadDir = path.join(process.cwd(), "public/uploads");
    // Ensure the directory exists, if not create it
    await mkdir(uploadDir, { recursive: true });
    // writing binary data to uploadDir
    await writeFile(path.join(uploadDir, filename), buffer);

    const heroData = {
      title: formData.get("title") as string,
      sub_title: formData.get("sub_title") as string,
      button_title: formData.get("button_title") as string,
      navigate_url: formData.get("navigate_url") as string,
      image: "/uploads/" + filename, // Path to image stored
      isActive: formData.get("isActive") === "true",
      seo: {
        title: formData.get("seo_title") as string,
        description: formData.get("seo_description") as string,
        keywords: (formData.get("seo_keywords") as string).split(","),
      },
    };

    const hero = await Hero.create(heroData);

    return successResponse(`${heroData.title} added successfully`, hero);
  } catch (err) {
    console.log("err : ", err);
    return errorResponse((err as Error).message, err, 500);
  }
}
