import { LogModuleError } from "../ModuleError/ModuleLoadError";
import { routes } from "./Routes";

export const AllRoutes = async () => {
  //* This is how we dynamically import the modules for the routes.
  const modules = [
    import("new_payment/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError),

    import("payments/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError),

    import("cryptoEcommerce/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError),

    import("newAccounts/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError),

    import("conversions/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError),

    import("receivable/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError),

    import("settings/listOfPrivateRoutesWrapped")
      .then((module) => module.default)
      .catch(LogModuleError)
  ];

  // Return All Routes in one array
  // If any module fails to load, a error component will be added to that route
  return Promise.all(modules)
    .then((result) => {
      // console.log("ROUTES LOADED: ", result);

      return [...routes, ...result].flat().filter((item) => item != null);
    })
    .finally(() => {
      console.log("All Modules Loaded");
    });
};
