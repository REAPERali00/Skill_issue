import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://skill-issue.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "5I84LzsbxsJ5",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "EVqplXkUEr6B",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "lwoj74DR8mET",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "21D8EsM6D188",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "Y_1vMIrXO9yT",
    },
    firstName: { type: "string", storageKey: "-eNmUn34r5Ni" },
    googleImageUrl: { type: "url", storageKey: "Gz4MPxhZc43h" },
    googleProfileId: { type: "string", storageKey: "gpidqc6TOsK6" },
    lastName: { type: "string", storageKey: "2eA6_NTyfBNO" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "TOMlvYHLs4uX",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "T2X5OS52E7h4",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "h6FJVzx7l8wz",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "R5UNgTYh3Cru",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "ChDCeSXaQ0qo",
    },
    todos: {
      type: "hasMany",
      children: { model: "todo", belongsToField: "user" },
      storageKey: "Wnmk6KJFFeHn",
    },
  },
};
