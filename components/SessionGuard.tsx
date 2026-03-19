"use client";

/**
 * SessionGuard
 *
 * Enforces the "Stay logged in" preference chosen at login time.
 *
 * Flow:
 *  - "Stay logged in" checked  → login page writes `localStorage.apg_remember_me = "1"`.
 *    Sessions persist across browser restarts (Supabase default behaviour).
 *
 *  - "Stay logged in" unchecked → login page writes `sessionStorage.apg_session_active = "1"`
 *    (tab-scoped) and removes the localStorage flag.
 *
 * On every page load:
 *  1. Does nothing if `apg_remember_me` is set  → persistent session.
 *  2. Does nothing if `sessionStorage.apg_session_active` is set → active tab.
 *  3. Otherwise, probes sibling tabs via BroadcastChannel and waits 150 ms:
 *       - A sibling tab replies → new tab in the same browser session;
 *         copy the sessionStorage flag and continue.
 *       - No reply → browser was restarted after a temporary login; sign out.
 *
 * The same channel instance is reused for both answering probes from other
 * tabs and sending/receiving the probe in step 3, eliminating any race
 * between listener setup and message dispatch.
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const CHANNEL = "apg_session";
const SESSION_KEY = "apg_session_active";
const REMEMBER_KEY = "apg_remember_me";

export default function SessionGuard() {
  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL);

    // Answer session_check probes from other tabs while this tab is active.
    const answerProbe = (e: MessageEvent) => {
      if (
        e.data?.type === "session_check" &&
        sessionStorage.getItem(SESSION_KEY) === "1"
      ) {
        bc.postMessage({ type: "session_alive" });
      }
    };
    bc.addEventListener("message", answerProbe);

    const enforceSessionPreference = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return; // no session → nothing to do

      // Persistent session — nothing to enforce.
      if (localStorage.getItem(REMEMBER_KEY) === "1") return;

      // This tab already has the active marker (e.g. the tab that did the login).
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;

      // The sessionStorage flag is missing. This is either:
      //   A) a new tab opened during the same browser session, or
      //   B) a page load after the browser was restarted (non-persistent login).
      //
      // Ask sibling tabs via BroadcastChannel. A session_alive response within
      // 150 ms means case A; silence means case B.
      const confirmedByAnotherTab = await new Promise<boolean>((resolve) => {
        let done = false;

        // Register listener on the SAME channel instance BEFORE posting the
        // probe so no response can arrive before we are ready to receive it.
        const handleAlive = (e: MessageEvent) => {
          if (e.data?.type === "session_alive" && !done) {
            done = true;
            bc.removeEventListener("message", handleAlive);
            resolve(true);
          }
        };
        bc.addEventListener("message", handleAlive);

        bc.postMessage({ type: "session_check" });

        setTimeout(() => {
          if (!done) {
            done = true;
            bc.removeEventListener("message", handleAlive);
            resolve(false);
          }
        }, 150);
      });

      if (confirmedByAnotherTab) {
        // A sibling tab confirmed the session is alive → propagate the flag.
        sessionStorage.setItem(SESSION_KEY, "1");
      } else {
        // No active tabs replied → browser restarted after a temporary login.
        localStorage.removeItem(REMEMBER_KEY);
        await supabase.auth.signOut();
      }
    };

    enforceSessionPreference();

    return () => {
      bc.removeEventListener("message", answerProbe);
      bc.close();
    };
  }, []);

  return null; // purely behavioural — renders nothing
}
