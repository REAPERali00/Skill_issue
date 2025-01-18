import { assert, deleteRecord, ActionOptions } from "gadget-server";
 

/** @type { ActionRun } */
export const run = async ({ record, logger, api }) => {
  try {
    // Find the userStat for this todo's user
    const userStat = await api.userStat.findFirst({
      filter: {
        user: {
          equals: record.user
        }
      }
    });

    // Verify userStat exists
    assert(userStat, "UserStat not found for user");
    
    // Calculate which value field to update based on the todo's skill
    const valueField = `${record.skill}Value`;
    
    // Update the userStat with the new skill value
    await api.userStat.update(userStat.id, {
      [valueField]: userStat[valueField] + record.score
    });

    // Delete the completed todo
    await deleteRecord(record);
  } catch (error) {
    logger.error(`Error completing todo ${record.id}: ${error.message}`);
    throw error;
  }
 
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
