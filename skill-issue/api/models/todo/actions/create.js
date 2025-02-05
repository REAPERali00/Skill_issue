import { applyParams, save, ActionOptions } from "gadget-server";
import Groq from "groq-sdk";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api, connections }) => {
  const client = new Groq({
    apiKey: process.env["GROQ_API_KEY"], // This is the default and can be omitted
  });

  applyParams(params, record);
  
  logger.info("Right before fetching User stats");

  const userStat = await api.userStat.findFirst({
        filter: {
          userId: { equals: record.userId },
        },
        select: {
          skillOne: true,
          skillTwo: true,
          skillThree: true,
          skillFour: true,
          skillFive: true,
        },
      });
  
  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "user", content: `You are evaluating tasks that a user gives you and you must weigh (assign them a numerical value, from 0 to 100) and match it/assign it to a skill out of 5 skills that are pretedetermined. A task worth 0 would be a task that seems really easy that may only take a few minutes, A task worth 100 would be a really hard task that may take a few days to a week. Here are the predetermined skills: ${userStat.skillOne}, ${userStat.skillTwo}, ${userStat.skillThree}, ${userStat.skillFour}, ${userStat.skillFive}. Here is the given task that's been done during the day: ${record.taskName}. Keep that answers SHORT and CONCISE. Simply respond with the value and the skill it was matched to out of the 5. The SKILL MUST MATCH EXACTLY ONE OF THE 5 SKILLS LISTED IN THE PREDETERMINED SKILLS. DO NOT COME UP WITH YOUR OWN. RETURN YOUR RESPONSE IN THE FOLLOWING FORMAT: VALUE COMMA SKILL` },
    ],
    model: "gemma2-9b-it",
  });

  const response = chatCompletion.choices[0].message.content;
  logger.info(`Message here: ${response}`);

  const strings = response.split(',').map(str => str.trim());
  const score = parseInt(strings[0], 10);
  const skill = strings[1];
  logger.info(`SKILL TO BE SAVED HERE: ${skill}`);
  logger.info(`SCORE TO BE SAVED HERE: ${score}`);
  

  record.skill = skill;
  record.score = score;

  logger.info(chatCompletion, "groq hit!");
  await save(record);
  
  
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
