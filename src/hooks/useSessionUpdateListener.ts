"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Custom hook to listen for session update events
 * Helps prevent infinite re-renders when updating the session
 */
export default function useSessionUpdateListener() {
  const { update } = useSession();

  useEffect(() => {
    const checkSessionUpdate = () => {
      const needsUpdate = localStorage.getItem("session-needs-update");
      if (needsUpdate === "true") {
        localStorage.removeItem("session-needs-update");
        update();
      }
    };

    const handleSessionUpdateEvent = () => {
      localStorage.setItem("session-needs-update", "true");
    };

    checkSessionUpdate();

    window.addEventListener("session-update-needed", handleSessionUpdateEvent);

    window.addEventListener("popstate", checkSessionUpdate);

    return () => {
      window.removeEventListener("session-update-needed", handleSessionUpdateEvent);
      window.removeEventListener("popstate", checkSessionUpdate);
    };
  }, [update]);
}
