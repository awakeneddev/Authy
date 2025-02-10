import dbConnect from "@/lib/db";
import Hero from "@/models/hero";
import { errorResponse, successResponse } from "@/utils/api/responseUtils";
import { mkdir, unlink, writeFile } from "fs/promises";
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

export async function PUT(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();

  try {
    const id = formData.get("id") as string;
    if (!id) {
      return errorResponse("Invalid or missing ID", "ID not found", 400);
    }
    const existingHero = await Hero.findById(id);
    if (!existingHero) {
      return errorResponse("Hero section no found", "ID not found", 404);
    }

    const file = formData.get("image") as File;
    let imagePath = existingHero.image;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return errorResponse(
          "Image size must be less than 5MB",
          "Bigger file size",
          413
        );
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return errorResponse(
          "Invalid file type",
          "Only images are allowed",
          415
        );
      }

      // processing new file
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name.replace(/\$+/g, "_");
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      // deleting old image
      try {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingHero.image
        );
        await unlink(oldImagePath);
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
      imagePath = "/uploads/" + filename;
    }
    // Build updated data
    const heroData = {
      title: formData.get("title") as string,
      sub_title: formData.get("sub_title") as string,
      button_title: formData.get("button_title") as string,
      navigate_url: formData.get("navigate_url") as string,
      image: imagePath,
      isActive: formData.get("isActive") === "true",
      seo: {
        title: formData.get("seo_title") as string,
        description: formData.get("seo_description") as string,
        keywords: (formData.get("seo_keywords") as string).split(","),
      },
    };

    // Update database entry
    const updatedHero = await Hero.findByIdAndUpdate(id, heroData, {
      new: true,
      runValidators: true,
    });

    return successResponse("Hero section updated successfully", updatedHero);
  } catch (err) {
    console.log(err);
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  const { id } = await req.json();

  if (!id) {
    return errorResponse("Invalid request", "ID not found", 400);
  }
  try {
    const existingHero = await Hero.findById(id);
    if (existingHero) {
      const imagePath = path.join(process.cwd(), "public", existingHero.image);
      await unlink(imagePath);

      await Hero.findByIdAndDelete(id);
    }
    return successResponse("Hero section deleted successfully", "Deleted", 201);
  } catch (err) {
    errorResponse((err as Error).message, err, 501);
  }
}
