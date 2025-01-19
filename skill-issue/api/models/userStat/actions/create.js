import { applyParams, save, ActionOptions } from "gadget-server";
import Groq from "groq-sdk";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections }) => {
  const client = new Groq({
  apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
});
  
  applyParams(params, record);
  await save(record);

  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Explain the importance of low latency LLMs' }],
    model: 'llama3-8b-8192',
  });

  logger.info(chatCompletion, "groq hit!");
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
