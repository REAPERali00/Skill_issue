import {
  applyParams,
  save,
  assert,
  ActionOptions,
  deleteRecord,
} from "gadget-server";

/** @type { ActionRun } */
export const run = async ({ params, record, logger, api }) => {
  applyParams(params, record);

  // Check if this todo is being completed
  if (params.isCompleted && !record.isCompleted) {
    try {
      logger.info("Processing todo completion", {
        todoId: record.id,
        skill: record.skill,
        score: record.score,
      });

      assert(record.user, "Todo must have an associated user");

      logger.info("Found todo with user", {
        todoId: record.id,
        userId: record.user.id,
      });

      // Find the userStat for this user
      const userStat = await api.userStat.findFirst({
        filter: {
          userId: { equals: record.user.id },
        },
        select: {
          id: true,
          skillOne: true,
          skillOneValue: true,
          skillTwo: true,
          skillTwoValue: true,
          skillThree: true,
          skillThreeValue: true,
          skillFour: true,
          skillFourValue: true,
          skillFive: true,
          skillFiveValue: true,
        },
      });

      assert(userStat, `No userStat found for user ID ${record.user.id}`);

      logger.info("Found userStat", {
        userStatId: userStat.id,
        userId: record.user.id,
      });

      // Determine which skill field to update
      let skillValueField = null;
      if (userStat.skillOne === record.skill) {
        skillValueField = "skillOneValue";
      } else if (userStat.skillTwo === record.skill) {
        skillValueField = "skillTwoValue";
      } else if (userStat.skillThree === record.skill) {
        skillValueField = "skillThreeValue";
      } else if (userStat.skillFour === record.skill) {
        skillValueField = "skillFourValue";
      } else if (userStat.skillFive === record.skill) {
        skillValueField = "skillFiveValue";
      }

      assert(
        skillValueField,
        `Todo skill "${record.skill}" does not match any skills in userStat for user ${record.user.id}`
      );

      logger.info("Updating userStat skill value", {
        userId: record.user.id,
        skill: record.skill,
        currentValue: userStat[skillValueField],
        addValue: record.score,
      });

      const updatedStat = await api.userStat.update(userStat.id, {
        [skillValueField]: userStat[skillValueField] + record.score,
      });

      assert(updatedStat, "Failed to update userStat");

      // await deleteRecord(record);
      logger.info("Successfully completed todo and updated skills", {
        todoId: record.id,
      });
    } catch (error) {
      logger.error("Failed to process todo completion", {
        todoId: record.id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  } else {
    await save(record);
  }
  actionType: "update";
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
