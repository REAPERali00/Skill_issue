// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/skill-issue
import { Client } from "@gadget-client/skill-issue";


export const api = new Client({ environment: window.gadgetConfig.environment });

