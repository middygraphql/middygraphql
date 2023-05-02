import { Ctx, MiddlewareFn, MiddlewareObj, Request, Resolver } from "./types";

function resolver(resolverHandler: Resolver) {
  const beforeMiddlewares: MiddlewareFn[] = [];
  const afterMiddlewares: MiddlewareFn[] = [];
  const onErrorMiddlewares: MiddlewareFn[] = [];

  function resolver(root: any, args: any, context: any, info: any) {
    return execute(
      { root, args, context, info },
      beforeMiddlewares,
      resolverHandler,
      afterMiddlewares,
      onErrorMiddlewares
    );
  }

  resolver.use = function (middlewares: MiddlewareObj | MiddlewareObj[]) {
    if (Array.isArray(middlewares)) {
      for (const middleware of middlewares) {
        resolver.applyMiddleware(middleware);
      }

      return resolver;
    }

    return resolver.applyMiddleware(middlewares);
  };

  resolver.applyMiddleware = function (middleware: MiddlewareObj = {}) {
    const { before, after, onError } = middleware;

    if (!before && !after && !onError) {
      throw new Error(
        'Middleware must be an object containing at least one key among "before", "after", "onError"'
      );
    }

    if (before) resolver.before(before);
    if (after) resolver.after(after);
    if (onError) resolver.onError(onError);

    return resolver;
  };

  // Inline Middlewares
  resolver.before = function (beforeMiddleware: MiddlewareFn) {
    beforeMiddlewares.push(beforeMiddleware);
    return resolver;
  };
  resolver.after = function (afterMiddleware: MiddlewareFn) {
    afterMiddlewares.unshift(afterMiddleware);
    return resolver;
  };
  resolver.onError = function (onErrorMiddleware: MiddlewareFn) {
    onErrorMiddlewares.push(onErrorMiddleware);
    return resolver;
  };

  resolver.__middlewares = {
    before: beforeMiddlewares,
    after: afterMiddlewares,
    onError: onErrorMiddlewares,
  };

  return resolver;
}

async function execute(
  request: Request,
  beforeMiddlewares: MiddlewareFn[],
  resolverHandler: Resolver,
  afterMiddlewares: MiddlewareFn[],
  onErrorMiddlewares: MiddlewareFn[]
) {
  try {
    await runMiddlewares(request, beforeMiddlewares);

    // Check if before stack hasn't exit early
    if (request.response === undefined) {
      request.response = await resolverHandler(request);

      await runMiddlewares(request, afterMiddlewares);
    }
  } catch (e: any) {
    // Reset response changes made by after stack before error thrown
    request.response = undefined;
    request.error = e;

    if (onErrorMiddlewares.length === 0) {
      throw e;
    }

    await runMiddlewares(request, onErrorMiddlewares);
  }

  return request.response;
}

async function runMiddlewares(request: Request, middlewares: MiddlewareFn[]) {
  for (const middleware of middlewares) {
    const res = await middleware?.(request);

    if (res !== undefined) {
      request.response = res;

      return;
    }
  }
}

export default <Args = any, Context = Ctx>(resolverHandler: Resolver<any, Args, Context>) => {
  return resolver(resolverHandler);
};

export * from "./types";
