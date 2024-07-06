import { NextResponse } from "next/server";
import { client } from "@/app/utils/algoliaRecommendationClient";
// related-products
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  console.log("User Id", userId);
  try {
    const results = await client.getRecommendations([
      {
        indexName: "candidates",
        model: "related-products",
        objectID: "chrisblesson2598@gmail.com",
      },
    ]);
    console.log("results", results);
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
