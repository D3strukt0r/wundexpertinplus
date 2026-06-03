import {createContext, createRequestHandler, RouterContextProvider} from 'react-router';

interface CloudflareEnv {
  env: Env;
  ctx: ExecutionContext;
}

// React Router v8 middleware is enabled (react-router.config.ts), so the
// request handler takes a `RouterContextProvider` rather than a plain
// `AppLoadContext` object. Expose the Cloudflare env/ctx through a typed
// context that loaders/actions/middleware can read via `context.get(...)`.
export const CloudflareContext = createContext<CloudflareEnv>();

const requestHandler = createRequestHandler(
  async () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const context = new RouterContextProvider();
    context.set(CloudflareContext, {env, ctx});
    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;
