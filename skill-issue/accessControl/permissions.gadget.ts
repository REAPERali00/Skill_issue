import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://skill-issue.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "signed-in": {
      storageKey: "signed-in",
      default: {
        read: true,
        action: true,
      },
      models: {
        session: {
          read: true,
        },
        todo: {
          read: {
            filter: "accessControl/filters/todo/signed-in-read.gelly",
          },
          actions: {
            analyzeImage: true,
            complete: {
              filter:
                "accessControl/filters/todo/signed-in-read.gelly",
            },
            create: true,
            delete: {
              filter:
                "accessControl/filters/todo/signed-in-read.gelly",
            },
            update: {
              filter:
                "accessControl/filters/todo/signed-in-read.gelly",
            },
          },
        },
        user: {
          read: {
            filter: "accessControl/filters/user/tenant.gelly",
          },
          actions: {
            changePassword: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            delete: true,
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signOut: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            signUp: true,
            update: true,
          },
        },
        userStat: {
          read: {
            filter:
              "accessControl/filters/userStat/signed-in-read.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        session: {
          read: true,
        },
        user: {
          read: true,
          actions: {
            changePassword: true,
            delete: true,
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signOut: true,
            signUp: true,
            update: true,
          },
        },
        userStat: {
          read: true,
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
      },
    },
    "Role A": {
      storageKey: "AvfVKuL3d6t7",
    },
    "Role B": {
      storageKey: "Oaglv89isLYc",
    },
  },
};
