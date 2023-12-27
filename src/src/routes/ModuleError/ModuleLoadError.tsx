import { ServiceNotAvailable } from "../../pages/Error/ServiceNotAvailable";

// All MFE Start with a name space
const ModuleLoadError = [
  // Add Regex here to match the
  // name space of the modules
  {
    path: "/new-payment",
    exact: true,
    title: "Error",
    element: () => (
      <ServiceNotAvailable
      // error={new Error("MFE Loading Failed")}
      // resetErrorBoundary={(args: any) => {
      //   // Try To reload
      //   console.log("args", args);
      // }}
      />
    )
  }
];

const LogModuleError = (err: any) => {
  console.group(
    "%c MFE - Module Loading Failed ",
    "background-color: purple; color: white"
  );
  console.error(err);
  console.groupEnd();
  return ModuleLoadError;
};

export { ModuleLoadError, LogModuleError };
