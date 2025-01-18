import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "userStat" model, go to https://skill-issue.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "Z4x_a1qR3tIQ",
  comment:
    "Stores user statistics, including their level and skill proficiency, with a unique one-to-one relationship to each user.",
  fields: {
    level: {
      type: "number",
      default: 1,
      decimals: 0,
      validations: { required: true },
      storageKey: "Z4x_a1qR3tIQ-level",
    },
    skillFive: {
      type: "string",
      validations: { required: true },
      storageKey: "Z4x_a1qR3tIQ-skillFive",
    },
    skillFiveValue: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 1000 },
      },
      storageKey: "Z4x_a1qR3tIQ-skillFiveValue",
    },
    skillFour: {
      type: "string",
      validations: { required: true },
      storageKey: "Z4x_a1qR3tIQ-skillFour",
    },
    skillFourValue: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 1000 },
      },
      storageKey: "Z4x_a1qR3tIQ-skillFourValue",
    },
    skillOne: {
      type: "string",
      validations: { required: true },
      storageKey: "Z4x_a1qR3tIQ-skillOne",
    },
    skillOneValue: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 1000 },
      },
      storageKey: "Z4x_a1qR3tIQ-skillOneValue",
    },
    skillThree: {
      type: "string",
      validations: { required: true },
      storageKey: "Z4x_a1qR3tIQ-skillThree",
    },
    skillThreeValue: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 1000 },
      },
      storageKey: "Z4x_a1qR3tIQ-skillThreeValue",
    },
    skillTwo: {
      type: "string",
      validations: { required: true },
      storageKey: "Z4x_a1qR3tIQ-skillTwo",
    },
    skillTwoValue: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 1000 },
      },
      storageKey: "Z4x_a1qR3tIQ-skillTwoValue",
    },
    user: {
      type: "belongsTo",
      validations: { required: true, unique: true },
      parent: { model: "user" },
      storageKey: "Z4x_a1qR3tIQ-user",
    },
  },
};
