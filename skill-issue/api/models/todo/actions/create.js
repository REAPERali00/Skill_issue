import { applyParams, save, ActionOptions } from "gadget-server";
import Groq from "groq-sdk";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections }) => {
  const client = new Groq({
    apiKey: process.env["GROQ_API_KEY"], // This is the default and can be omitted
  });

  applyParams(params, record);
  await save(record);

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "user", content: "You are evaluating tasks that a user gives you and you must weigh (assign them a numerical value, from 0 to 100) and match it/assign it to a skill out of 5 skills that are pretedetermined. A task worth 0 would be a task that seems really easy that may only take a few minutes, A task worth 100 would be a really hard task that may take a few days to a week. Here are the predetermined skills: Coding, Physique, Math, Reading, Singing. Here is the given task that's been done during the day: Leetcode for 3 hours today. Keep that answers SHORT and CONCISE. Simply respond with the value and the skill it was matched to out of the 5" },
    ],
    model: "mixtral-8x7b-32768",
  });

  logger.info(chatCompletion, "groq hit!");
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
