import { NextResponse } from "next/server";

export async function POST(request) {
  const { prompt } = await request.json();
  console.log("This prompt", prompt);
  if (!prompt) {
    return NextResponse.json(
      { message: "Prompt is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: prompt }],
    //     max_tokens: 150,
    //   }),
    // });

    // const data = await response.json();
    const data = {
      id: "chatcmpl-9kyHzmRWHSkXuFaNYpQG2NpAKXu0K",
      object: "chat.completion",
      created: 1720981867,
      model: "gpt-3.5-turbo-0125",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              "Here at our company, we pride ourselves on embracing a set of core values that guide our decision-making, action, and behavior. These values were inspired by the principles that have made companies like Amazon successful and have been adapted to fit our unique culture and goals. Our values include:\n\n1. Customer Obsession: Putting our customers at the center of everything we do and constantly striving to exceed their expectations.\n\n2. Innovation: Embracing a culture of continuous improvement, creativity, and forward-thinking to stay ahead of the curve.\n\n3. Operational Excellence: Consistently delivering high-quality products and services with efficiency and precision.\n\n4. Sustainability: Committing to environmental responsibility and social impact in all aspects of our business operations.\n\n5. Diversity and Inclusion",
          },
          logprobs: null,
          finish_reason: "length",
        },
      ],
      usage: {
        prompt_tokens: 23,
        completion_tokens: 150,
        total_tokens: 173,
      },
      system_fingerprint: null,
    };

    // if (!response.ok) {
    //   return NextResponse.json(
    //     { message: data.error.message },
    //     { status: response.status }
    //   );
    // }

    return NextResponse.json({ content: data?.choices?.[0]?.message?.content });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
