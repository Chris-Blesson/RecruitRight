import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPEN_AI_KEY,
});

const SYSTEM_PROMPT =
  "You are a smart assistant to career advisors at the Harvard Extension School. You will be given a set of question and answers from candidates, and the resume of the candidate. You will evaluate the candidate for the role based on their answers to the questions and their resume. You will provide the relevancy percentage out of 100 based on the evaluation and provide the reason for the score. You will reply with JSON only.";

const EVALUATION_PROMPT = `
You are going to evaluate an applicant applying for <ROLE> job.

Consider the following CV:
<CV_TEXT>

Consider the following questions and answers
<TEST_RESPONSE>

Now consider the following TypeScript Interface for the JSON schema:

interface candidate_relevancy {
    relevancy_score: number;
    reason: string;
}

Write the candidate relevancy section according to the candidate_relevancy schema. On the response, include only the JSON.
`;

export const responseEvaluator = async ({ cvText, testRespone, role }) => {
  try {
    const filledEvaluationPrompt = EVALUATION_PROMPT.replace(
      "<CV_TEXT>",
      JSON.stringify(cvText)
    )
      .replace("<TEST_RESPONSE>", JSON.stringify(testRespone))
      .replace("<ROLE>", role);
    console.log("filledPrompt", filledEvaluationPrompt);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        { role: "user", content: filledEvaluationPrompt },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    console.log("completion payload", JSON.stringify(completion));
    const responsePayload = completion?.choices[0].message.content;
    return responsePayload;
  } catch (err) {
    console.log("Response evaluator error", err);
    throw err;
  }
};
