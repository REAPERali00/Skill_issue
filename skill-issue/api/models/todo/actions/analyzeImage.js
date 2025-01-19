import { assert } from "gadget-server";
import { groq } from "../services/groq";
 
export const params = {
  base64Image: { type: "string" },
  userId: { type: "string" }
}

export const run = async ({ params, logger, api }) => {
  // Validate inputs
  assert(params.base64Image, "base64Image is required");
  assert(params.userId, "userId is required");
 
  // Get user's stats to access their skills
  const userStat = await api.userStat.findFirst({
    filter: {
      user: {
        id: {
          equals: params.userId
        }
      }
    }
  });
 
  assert(userStat, "User stats not found");
 
  // Prepare skills list for the prompt
  const skills = [
    userStat.skillOne,
    userStat.skillTwo,
    userStat.skillThree,
    userStat.skillFour,
    userStat.skillFive
  ].filter(Boolean);
 
  // Analyze image using Groq
  const prompt = `Analyze this image and identify potential tasks. For each task:
    1. Create a brief, clear task name (max 80 characters)
    2. Map it to one of these skills: ${skills.join(", ")}
    3. Assign a difficulty score (0-1000)
    4. Do this for each task you see in the image
    Format the response as JSON array: [{"taskName": "...", "skill": "...", "score": 123}, ...]`;
 
  const analysis = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image",
            image: params.base64Image
          }
        ]
      }
    ]
  });
 
  const tasks = JSON.parse(analysis.choices[0]?.message?.content || "[]");
 
  // Create todos from the tasks
  const createdTodos = await Promise.all(
    tasks.map(task => api.todo.create({
      ...task,
      user: { _link: params.userId }
    }))
  );
  return createdTodos;
}