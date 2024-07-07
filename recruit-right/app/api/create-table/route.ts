import { CreateAccountTable } from "@/lib/tableCreationScripts/accountsTable";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const body = await req.json();
  const { entity } = body;
  switch (entity) {
    case "accounts":
      await CreateAccountTable();
      break;
    default:
      break;
  }
  return NextResponse.json({
    message: "success",
  });
}
