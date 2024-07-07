import { NextResponse } from "next/server";

import { client } from "@/app/utils/algoliaSearchClient";

export async function POST(req: Request) {
  try {
    const jobsIndex = client.initIndex("jobs");

    const payload = await req.json();
    const { jobId, ...rest } = payload;
    console.log({
      objectId: jobId,
      ...rest,
    });
    jobsIndex
      .saveObjects([{ objectID: jobId, ...rest }], {
        autoGenerateObjectIDIfNotExist: true,
      })
      .then(({ objectIDs }: { objectIDs: String[] }) => {
        console.log(objectIDs);
      });
    return NextResponse.json(payload);
  } catch (e) {
    const error = JSON.stringify(e);
    return NextResponse.json({
      error,
    });
  }
}
