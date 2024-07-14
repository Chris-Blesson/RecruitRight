import { CreateAccountTable } from "@/lib/tableCreationScripts/accountsTable";
import { CreateSubmissionsTable } from "@/lib/tableCreationScripts/submissionsTable";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const body = await req.json();
  const { entity } = body;
  switch (entity) {
    case "accounts":
      await CreateAccountTable();
      break;
    case "submissions":
      await CreateSubmissionsTable();
      break;
    default:
      break;
  }
  return NextResponse.json({
    message: "success",
  });
}
