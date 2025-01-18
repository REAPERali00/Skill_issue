import { assert } from "gadget-server";
import { groq } from "../services/groq";

export const params = {
  prompt: { type: "string" }
};
 
/** @type { ActionRun } */
export const run = async ({ params, logger }) => {
  try {
    // Validate the prompt parameter
    const prompt = assert(params.prompt, "Prompt is required");

    // Make request to GROQ
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    logger.error({ error }, "Error making GROQ request");
    throw error;
  }
};
