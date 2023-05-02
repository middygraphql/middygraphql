import { GraphQLError, GraphQLResolveInfo } from "graphql";

export interface Ctx {
  [key: string]: any;
}

export type Request<Root = any, Args = any, Context = Ctx, Response = any> = ResolverData<
  Root,
  Args,
  Context
> & {
  response?: Response;
  error?: GraphQLError;
};

export type MiddlewareFn<Root = any, Args = any, Context = Ctx, Response = any> = (
  data: Request<Root, Args, Context, Response>
) => Response;

export interface MiddlewareObj<Root = any, Args = any, Context = Ctx, Response = any> {
  before?: MiddlewareFn<Root, Args, Context, Response>;
  after?: MiddlewareFn<Root, Args, Context, Response>;
  onError?: MiddlewareFn<Root, Args, Context, Response>;
}

export type Resolver<Root = any, Args = any, Context = any, Response = any> = (
  data: ResolverData<Root, Args, Context>
) => Response;

export interface ResolverData<Root, Args, Context = Ctx> {
  root: Root;
  args: Args;
  context: Context;
  info: GraphQLResolveInfo;
}
