import { NextResponse } from "next/server";
import { client } from "@/app/utils/algoliaRecommendationClient";
// related-products
export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  try {
    client
      .getRecommendations({
        indexName: "jobs",
        model: "related-products",
        objectID: jobId,
      })
      .then(({ results }) => {
        console.log(results);
      });
    return NextResponse.json({
      status: "ok",
    });
  } catch (e) {
    const error = JSON.stringify(e);
    console.log(error);
    return NextResponse.json({
      error,
    });
  }
}
