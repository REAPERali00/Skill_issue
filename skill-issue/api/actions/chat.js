import { assert } from "gadget-server";
import { groqClient, createChatCompletion } from "../services/groq.js";

export const params = {
  message: { type: "string" }
  try {
    const message = assert(params.message, "Message is required");
    
    const response = await createChatCompletion(groqClient, message);
    
    return {
      reply: response
    };

  } catch (error) {
    logger.error({ error }, "Error in chat completion");
    throw new Error("Failed to process chat message");
  }
};
 
export const options = {
  triggers: { api: true }
};

/** @type { ActionRun } */
export const run = async ({ params, logger, api, connections }) => {
};
