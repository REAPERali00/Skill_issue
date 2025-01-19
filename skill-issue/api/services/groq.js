import { Groq } from "groq-sdk";
import { assert } from "gadget-server";

/**
 * Assert that the GROQ API key environment variable is configured
 * @throws {Error} If GROQ_API_KEY is not set
 */
assert(
  process.env.GROQ_API_KEY,
  "Missing GROQ_API_KEY environment variable. " +
  "Please set this environment variable in your Gadget app settings. " +
  "You can get an API key from https://console.groq.com/keys"
);

/**
 * Singleton instance of the GROQ client for use in backend code
 * @type {Groq}
 */
export const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Creates a chat completion using the Groq API
 * @param {Array<{role: string, content: string}>} messages - Array of chat messages
 * @param {Object} options - Additional options for the chat completion
 * @param {string} [options.model="mixtral-8x7b-32768"] - The model to use
 * @param {number} [options.temperature=0.7] - Sampling temperature
 * @param {number} [options.maxTokens=2048] - Maximum number of tokens to generate
 * @returns {Promise<{role: string, content: string}>} The assistant's response message
 * @throws {Error} If the API request fails
 */
export async function createChatCompletion(messages, options = {}) {
  try {
    const completion = await groqClient.chat.completions.create({
      messages,
      model: options.model ?? "mixtral-8x7b-32768",
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    });

    if (!completion.choices?.[0]?.message) {
      throw new Error("No completion message received from Groq API");
    }

    return completion.choices[0].message;
  } catch (error) {
    // Enhance error message for better debugging
    throw new Error(
      `Failed to create chat completion: ${
        error instanceof Error 
          ? error.message 
          : "Unknown error"
      }`
    );
  }
}