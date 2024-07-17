import { CreateAccountTable } from "@/lib/tableCreationScripts/accountsTable";
import { CreateCreditsTable } from "@/lib/tableCreationScripts/creditsTable";
import { CreateJobTable } from "@/lib/tableCreationScripts/jobTable";
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
    case "jobs":
      await CreateJobTable();
      break;
    case "credits":
      await CreateCreditsTable();
      break;
    default:
      break;
  }
  return NextResponse.json({
    message: "success",
  });
}
