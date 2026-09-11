/** Experimental browser API adapter. Never replaces another tool or clears a context. */
export type ToolResult = { content: { type: "text"; text: string }[]; isError?: true };
export type ReadOnlyTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: true; untrustedContentHint: true; consequentialHint: false };
  execute: (input: unknown, options?: { signal?: AbortSignal }) => Promise<ToolResult>;
};
export type ModelContext = {
  registerTool: (tool: ReadOnlyTool, options?: { signal: AbortSignal }) => void | Promise<void>;
  unregisterTool?: (name: string) => void;
};
export type Installation = { ready: Promise<readonly string[]>; dispose: () => void };
const installations = new WeakMap<ModelContext, Installation>();

/** Prefer the current document API; tolerate older navigator-based implementations. */
export function resolveModelContext(documentValue: unknown, navigatorValue?: unknown): ModelContext | null {
  for (const owner of [documentValue, navigatorValue]) {
    try {
      const context = (owner as { modelContext?: ModelContext } | null)?.modelContext;
      if (context && typeof context.registerTool === "function") return context;
    } catch { /* Disabled permissions must not break the ordinary page. */ }
  }
  return null;
}

export function installReadOnlyTools(context: ModelContext, tools: readonly ReadOnlyTool[]): Installation {
  const existing = installations.get(context);
  if (existing) return existing;
  const controller = new AbortController();
  const owned = new Set<string>();
  let disposed = false;
  const cleanOwned = () => {
    controller.abort();
    // Legacy browsers use unregisterTool. Only successful registrations belong to us.
    for (const name of owned) {
      try { context.unregisterTool?.(name); } catch { /* Best-effort legacy cleanup. */ }
    }
    owned.clear();
  };
  const installation: Installation = {
    ready: Promise.resolve([]),
    dispose() {
      disposed = true;
      cleanOwned();
      // Keep the installation locked until pending legacy registration settles.
      void installation.ready.then(() => {
        cleanOwned();
        if (installations.get(context) === installation) installations.delete(context);
      });
    },
  };
  installations.set(context, installation);
  installation.ready = Promise.resolve().then(async () => {
    try {
      for (const tool of tools) {
        if (disposed) break;
        await context.registerTool(tool, { signal: controller.signal });
        owned.add(tool.name);
      }
      if (disposed) { cleanOwned(); return []; }
      return [...owned];
    } catch {
      // A rejected/duplicate tool must not leave a misleading partial installation.
      disposed = true;
      cleanOwned();
      if (installations.get(context) === installation) installations.delete(context);
      return [];
    }
  });
  return installation;
}
