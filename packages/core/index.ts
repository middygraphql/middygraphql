import { GraphQLError, GraphQLResolveInfo } from "graphql";

const middy = <TRoot = any, TArgs = any, TContext = any>(
  graphqlResolver: Resolver<TRoot, TArgs, TContext>
) => {
  const beforeMiddlewares: MiddlewareFn[] = [];
  const afterMiddlewares: MiddlewareFn[] = [];
  const onErrorMiddlewares: MiddlewareFn[] = [];

  function middyHandler(root: TRoot, args: TArgs, context: TContext, info: GraphQLResolveInfo) {
    const request = {
      root,
      args,
      context,
      info,
    };

    return runRequest(
      request,
      [...beforeMiddlewares],
      graphqlResolver,
      [...afterMiddlewares],
      [...onErrorMiddlewares]
    );
  }

  const middy = middyHandler as MiddyHandler<TRoot, TArgs, TContext>;

  middy.use = (middlewares) => {
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares];
    }
    for (const middleware of middlewares) {
      const { before, after, onError } = middleware;

      if (!before && !after && !onError) {
        throw new Error(
          'Middleware must be an object containing at least one key among "before", "after", "onError"'
        );
      }

      if (before) middy.before(before);
      if (after) middy.after(after);
      if (onError) middy.onError(onError);
    }
    return middy;
  };

  middy.applyMiddleware = function (middleware: MiddlewareObj<TRoot, TArgs, TContext> = {}) {
    const { before, after, onError } = middleware;

    if (!before && !after && !onError) {
      throw new Error(
        'Middleware must be an object containing at least one key among "before", "after", "onError"'
      );
    }

    if (before) middy.before(before);
    if (after) middy.after(after);
    if (onError) middy.onError(onError);

    return middy;
  };

  // Inline Middlewares
  middy.before = (beforeMiddleware) => {
    beforeMiddlewares.push(beforeMiddleware);
    return middy;
  };
  middy.after = (afterMiddleware) => {
    afterMiddlewares.unshift(afterMiddleware);
    return middy;
  };
  middy.onError = (onErrorMiddleware) => {
    onErrorMiddlewares.unshift(onErrorMiddleware);
    return middy;
  };

  return middy;
};

const runRequest = async (
  request: Request,
  beforeMiddlewares: MiddlewareFn[],
  graphqlResolver: Resolver,
  afterMiddlewares: MiddlewareFn[],
  onErrorMiddlewares: MiddlewareFn[]
) => {
  try {
    await runMiddlewares(request, beforeMiddlewares);

    // Check if before stack hasn't exit early
    if (typeof request.response === "undefined") {
      request.response = await graphqlResolver(request);

      await runMiddlewares(request, afterMiddlewares);
    }
  } catch (e) {
    request.response = undefined;
    request.error = e;

    try {
      await runMiddlewares(request, onErrorMiddlewares);
    } catch (e) {
      // Save error that wasn't handled
      e.originalError = request.error;
      request.error = e;

      throw request.error;
    }
    // Catch if onError stack hasn't handled the error
    if (typeof request.response === "undefined") throw request.error;
  }

  return request.response;
};

const runMiddlewares = async (request: Request, middlewares: MiddlewareFn[]) => {
  for await (const nextMiddleware of middlewares) {
    const res = await nextMiddleware(request);

    // short circuit chaining and respond early
    if (typeof res !== "undefined") {
      request.response = res;
      return;
    }
  }
};

export default middy;

export type Resolver<TRoot = any, TArgs = any, TContext = any> = (
  data: ResolverData<TRoot, TArgs, TContext>
) => any;

export interface ResolverData<TRoot = any, TArgs = any, TContext = any> {
  root: TRoot;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
}

export type Request<TRoot = any, TArgs = any, TContext = any> = ResolverData<
  TRoot,
  TArgs,
  TContext
> & {
  response?: any;
  error?: GraphQLError;
};

export type MiddlewareFn<TRoot = any, TArgs = any, TContext = any> = (
  data: Request<TRoot, TArgs, TContext>
) => any;

export interface MiddlewareObj<TRoot = any, TArgs = any, TContext = any> {
  before?: MiddlewareFn<TRoot, TArgs, TContext>;
  after?: MiddlewareFn<TRoot, TArgs, TContext>;
  onError?: MiddlewareFn<TRoot, TArgs, TContext>;
}

export type MiddyInputHandler<TRoot = any, TArgs = any, TContext = any> = (
  root: TRoot,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => any;

export type MiddyInputPromiseHandler<TRoot = any, TArgs = any, TContext = any> = (
  root: TRoot,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<any>;

export interface MiddyHandler<TRoot = any, TArgs = any, TContext = any>
  extends MiddyInputHandler<TRoot, TArgs, TContext>,
    MiddyInputPromiseHandler<TRoot, TArgs, TContext> {
  use: (
    middlewares: MiddlewareObj<TRoot, TArgs, TContext> | MiddlewareObj<TRoot, TArgs, TContext>[]
  ) => MiddyHandler<TRoot, TArgs, TContext>;
  before: (
    middleware: MiddlewareFn<TRoot, TArgs, TContext>
  ) => MiddyHandler<TRoot, TArgs, TContext>;
  after: (middleware: MiddlewareFn<TRoot, TArgs, TContext>) => MiddyHandler<TRoot, TArgs, TContext>;
  onError: (
    middleware: MiddlewareFn<TRoot, TArgs, TContext>
  ) => MiddyHandler<TRoot, TArgs, TContext>;
  applyMiddleware: (middleware: MiddlewareObj) => MiddyHandler<TRoot, TArgs, TContext>;
}
