import { useEffect } from "react";

function useTriggerPrint(trigger: () => void) {
  useEffect(() => {
    const handlePrintShortcut = (event: KeyboardEvent) => {
      // Check for Ctrl+P or Cmd+P
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
        event.preventDefault(); // Stop the default print dialog
        trigger();
      }
    };

    window.addEventListener("keydown", handlePrintShortcut);
    return () => {
      window.removeEventListener("keydown", handlePrintShortcut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useTriggerPrint;
