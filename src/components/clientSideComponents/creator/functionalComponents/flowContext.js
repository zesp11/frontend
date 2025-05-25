import { createContext, useContext } from "react";

const FlowContext = createContext(null);

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};

export default FlowContext;
