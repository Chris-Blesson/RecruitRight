// Ref: https://dev.to/xhowais/nextjs-file-upload-api-documentation-3863
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json(
      { message: "No files received." },
      { status: 400 }
    );
  }

  //@ts-ignore
  const buffer = Buffer.from(await file.arrayBuffer());

  // Replace spaces in the file name with underscores
  //@ts-ignore
  const filename = file.name.replaceAll(" ", "_");

  try {
    // Write the file to the specified directory (public/assets) with the modified filename
    await writeFile(path.join(process.cwd(), "./" + filename), buffer);

    //TODO: Delete the file once uploaded to cloudinary
    //TODO: Start parsing the request

    // Return a JSON response with a success message and a 201 status code
    return NextResponse.json({ message: "Success", status: 201 });
  } catch (error) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
    console.log("Error occurred ", error);
    return NextResponse.json({ message: "Failed", status: 500 });
  }
}
