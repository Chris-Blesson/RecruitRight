import { NextResponse } from "next/server";
import { client } from "@/app/utils/algoliaRecommendationClient";
// related-products
export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  try {
    const { results } = await client.getRecommendations([
      {
        indexName: "jobs",
        model: "related-products",
        objectID: jobId,
      },
    ]);
    return NextResponse.json({
      results,
      status: "ok",
    });
  } catch (e) {
    const error = e;
    console.log(error);
    return NextResponse.json({
      error,
    });
  }
}
