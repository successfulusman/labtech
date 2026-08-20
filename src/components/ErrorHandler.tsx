"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

let lastShown = 0;

export function ErrorHandler() {
  useEffect(() => {
    const notify = (message: string) => {
      const now = Date.now();
      if (now - lastShown < 4000) return;
      lastShown = now;
      toast.error(message, { duration: 4000 });
    };

    const onError = (event: ErrorEvent) => {
      notify("Unexpected error: " + (event.message || "unknown"));
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      notify("Request failed: " + (reason?.message || "unknown"));
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}