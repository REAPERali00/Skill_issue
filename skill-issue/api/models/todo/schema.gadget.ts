import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "todo" model, go to https://skill-issue.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "OwL0fsYJTYju",
  comment:
    "Model representing a todo task assigned to a user, capturing task details and completion status for user-specific task management.",
  fields: {
    isCompleted: {
      type: "boolean",
      default: false,
      storageKey: "OwL0fsYJTYju-isCompleted",
    },
    score: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 100 },
      },
      storageKey: "OwL0fsYJTYju-score",
    },
    skill: {
      type: "string",
      validations: { required: true },
      storageKey: "OwL0fsYJTYju-skill",
    },
    taskName: {
      type: "string",
      validations: {
        required: true,
        stringLength: { min: null, max: 80 },
      },
      storageKey: "OwL0fsYJTYju-taskName",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "OwL0fsYJTYju-user",
    },
  },
};
