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

  // Load the todo with user relationship
  const todo = await api.todo.findOne(record.id, {
    select: {
      id: true,
      skill: true,
      score: true,
      user: {
        id: true,
      },
    },
  });

  assert(todo, `Todo with ID ${record.id} not found`);
  assert(todo.user, `Todo ${record.id} has no associated user`);

  logger.info("Processing todo completion", {
    todoId: todo.id,
    skill: todo.skill,
    score: record.score,
  });

  // Check if this todo is being completed
  if (!todo.isCompleted) {
    try {
      logger.info("Found todo with user", {
        todoId: record.id,
        userId: todo.user.id,
      });

      // Find the userStat for this user
      const userStat = await api.userStat.findFirst({
        filter: {
          userId: { equals: todo.user.id },
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

      assert(userStat, `No userStat found for user ID ${todo.user.id}`);

      logger.info("Found userStat", {
        userStatId: userStat.id,
        userId: todo.user.id,
      });

      const todoSkill = todo.skill?.trim() ?? "";
      assert(todoSkill, "Todo skill cannot be empty");

      // Determine which skill field to update
      let skillValueField = null;
      if (userStat.skillOne?.trim() === todoSkill) {
        skillValueField = "skillOneValue";
      } else if (userStat.skillTwo?.trim() === todoSkill) {
        skillValueField = "skillTwoValue";
      } else if (userStat.skillThree?.trim() === todoSkill) {
        skillValueField = "skillThreeValue";
      } else if (userStat.skillFour?.trim() === todoSkill) {
        skillValueField = "skillFourValue";
      } else if (userStat.skillFive?.trim() === todoSkill) {
        skillValueField = "skillFiveValue";
      }

      assert(
        skillValueField,
        `Todo skill "${todoSkill}" does not match any skills in userStat for user ${todo.user.id}`
      );

      logger.info("Updating userStat skill value", {
        userId: todo.user.id,
        skill: todoSkill,
        currentValue: userStat[skillValueField],
        addValue: todo.score,
      });

      const updatedStat = await api.userStat.update(userStat.id, {
        [skillValueField]: userStat[skillValueField] + todo.score,
      });

      assert(updatedStat, "Failed to update userStat");

      await deleteRecord(record);
      logger.info("Successfully completed todo and updated skills", {
        todoId: record.id,
      });
    } catch (error) {
      logger.error("Failed to process todo completion", {
        todoId: record.id,
        error: error.message || "Unknown error",
        stack: error.stack,
      });
      throw error;
    }
  } else {
    try {
      await save(record);
      logger.info("Successfully updated todo", {
        todoId: record.id,
        skill: todo.skill,
      });
    } catch (error) {
      logger.error("Failed to update todo", {
        todoId: record.id,
        error: error.message || "Unknown error",
        stack: error.stack,
      });
      throw error;
    }
  }
};
/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
