import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://skill-issue.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "n4LkgRGZ9R_3",
  fields: {
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "MQS90d1W2j3g",
    },
  },
};
