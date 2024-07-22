import { NextResponse } from "next/server";
import { client } from "@/app/utils/algoliaRecommendationClient";
// related-products
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const { results } = await client.getRecommendations([
      {
        indexName: "candidates",
        model: "related-products",
        objectID: userId,
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
