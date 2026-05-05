"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/gtag";

/**
 * GrowthLoopTracker handles detection of "Magic Moments" and other
 * growth-related behavioral milestones on the client side.
 */
export function GrowthLoopTracker() {
  useEffect(() => {
    // 1. Track "Magic Moment" - 3+ successful extractions
    // We check this by looking at the history length or a specific counter
    const checkMagicMoment = () => {
      try {
        const history = JSON.parse(localStorage.getItem("clipkeep:history") || "[]");
        const hasReachedMagicMoment = localStorage.getItem("clipkeep:magic_moment_reached") === "true";
        
        if (history.length >= 3 && !hasReachedMagicMoment) {
          trackEvent("magic_moment_reached", { 
            extraction_count: history.length,
            milestone: "3_extractions"
          });
          localStorage.setItem("clipkeep:magic_moment_reached", "true");
        }
      } catch (e) {
        // Ignore storage errors
      }
    };

    // 2. Track "Return Visit" - User coming back with existing history
    const trackReturnVisit = () => {
      try {
        const history = JSON.parse(localStorage.getItem("clipkeep:history") || "[]");
        const isReturnUser = history.length > 0;
        
        // We only track this once per session
        if (isReturnUser && !sessionStorage.getItem("clipkeep:return_visit_tracked")) {
          trackEvent("return_visit_with_history", { 
            history_count: history.length 
          });
          sessionStorage.setItem("clipkeep:return_visit_tracked", "true");
        }
      } catch (e) {
        // Ignore storage errors
      }
    };

    checkMagicMoment();
    trackReturnVisit();
  }, []);

  return null;
}
