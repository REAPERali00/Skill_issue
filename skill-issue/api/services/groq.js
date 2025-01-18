import { Groq } from "groq-sdk";

/**
 * Throw an error if the GROQ API key is not configured
 */
if (!process.env.GROQ_API_KEY) {
  throw new Error(
    "Missing GROQ_API_KEY environment variable. " +
    "Please set this environment variable in your Gadget app settings. " +
    "You can get an API key from https://console.groq.com/keys"
  );
}

/**
 * Singleton instance of the GROQ client for use in backend code
 * @type {Groq}
 */
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
