import { NextResponse } from "next/server";

import { client } from "@/app/utils/algoliaSearchClient";
import { transformCandidatePayload } from "@/app/utils/transforms";

export async function POST(req: Request) {
  const candidatesIndex = client.initIndex("candidates");
  try {
    const candidate = await req.json();
    const { userId, userValues } = transformCandidatePayload(candidate);
    candidatesIndex
      .saveObjects([{ objectID: userId, ...userValues }], {
        autoGenerateObjectIDIfNotExist: true,
      })
      .then(({ objectIDs }: { objectIDs: [string] }) => {
        console.log(objectIDs);
      });
    return NextResponse.json({
      userId,
      userValues,
    });
  } catch (e) {
    const error = JSON.stringify(e);
    return NextResponse.json({
      error,
    });
  }
}
