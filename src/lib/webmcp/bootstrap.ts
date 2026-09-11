import { installReadOnlyTools, resolveModelContext } from "./registry.ts";
import { createReadOnlyTools } from "./tools.ts";

// Progressive enhancement only: no polyfill, new server, credential, or DOM changes.
const eligible = typeof window !== "undefined" && window.isSecureContext && window.top === window &&
  ["/", "/activities/live", "/activities/live/"].includes(window.location.pathname);
const context = eligible ? resolveModelContext(document, navigator) : null;
if (context) {
  const installation = installReadOnlyTools(context, createReadOnlyTools({
    loadRecaps: () => import("../../data/streamRecaps.ts").then(module => module.streamRecaps),
    loadSchedule: (input, signal) => import("./schedule.ts").then(module => module.loadPublicSchedule(input, signal)),
  }));
  // Registration errors are contained by the adapter; unsupported browsers remain unchanged.
  void installation.ready;
  if (import.meta.hot) import.meta.hot.dispose(() => installation.dispose());
}
