import middy, { MiddlewareFn } from "../index";

test('Middleware attached with "use" must be an object or array[object]', () => {
  const handler = middy(() => {});

  try {
    handler.use({});
  } catch (err) {
    expect(err.message).toBe(
      'Middleware must be an object containing at least one key among "before", "after", "onError"'
    );
  }

  try {
    handler.use({ foo: "bar" } as any);
  } catch (err) {
    expect(err.message).toBe(
      'Middleware must be an object containing at least one key among "before", "after", "onError"'
    );
  }

  try {
    handler.use(["before"] as any);
  } catch (err) {
    expect(err.message).toBe(
      'Middleware must be an object containing at least one key among "before", "after", "onError"'
    );
  }
});

test('"use" can add single before middleware', () => {
  const handler = middy(() => {});
  const before = () => {};
  const middleware = () => ({ before });
  handler.use(middleware());

  expect(handler.__middlewares.before[0]).toEqual(before);
});

test('"use" can add single after middleware', () => {
  const handler = middy(() => {});
  const after = () => {};
  const middleware = () => ({ after });
  handler.use(middleware());

  expect(handler.__middlewares.after[0]).toEqual(after);
});

test('"use" can add single onError middleware', () => {
  const handler = middy(() => {});
  const onError = () => {};
  const middleware = () => ({ onError });
  handler.use(middleware());

  expect(handler.__middlewares.onError[0]).toEqual(onError);
});

test('"use" can add single object with all types of middlewares', () => {
  const handler = middy(() => {});
  const before = () => {};
  const after = () => {};
  const onError = () => {};
  const middleware = () => ({ before, after, onError });
  handler.use(middleware());

  expect(handler.__middlewares.before[0]).toEqual(before);
  expect(handler.__middlewares.after[0]).toEqual(after);
  expect(handler.__middlewares.onError[0]).toEqual(onError);
});

test('"use" can add multiple before middleware', () => {
  const handler = middy(() => {});
  const before = () => {};
  const middleware = () => ({ before });
  handler.use([middleware(), middleware()]);
  expect(handler.__middlewares.before[0]).toEqual(before);
  expect(handler.__middlewares.before[1]).toEqual(before);
});

test('"use" can add multiple after middleware', () => {
  const handler = middy(() => {});
  const after = () => {};
  const middleware = () => ({ after });
  handler.use([middleware(), middleware()]);
  expect(handler.__middlewares.after[0]).toEqual(after);
  expect(handler.__middlewares.after[1]).toEqual(after);
});

test('"use" can add multiple onError middleware', () => {
  const handler = middy(() => {});
  const onError = () => {};
  const middleware = () => ({ onError });
  handler.use([middleware(), middleware()]);
  expect(handler.__middlewares.onError[0]).toEqual(onError);
  expect(handler.__middlewares.onError[1]).toEqual(onError);
});

test('"use" can add multiple object with all types of middlewares', () => {
  const handler = middy(() => {});
  const before = () => {};
  const after = () => {};
  const onError = () => {};
  const middleware = () => ({ before, after, onError });
  handler.use([middleware(), middleware()]);

  expect(handler.__middlewares.before[0]).toEqual(before);
  expect(handler.__middlewares.after[0]).toEqual(after);
  expect(handler.__middlewares.onError[0]).toEqual(onError);
  expect(handler.__middlewares.before[1]).toEqual(before);
  expect(handler.__middlewares.after[1]).toEqual(after);
  expect(handler.__middlewares.onError[1]).toEqual(onError);
});

test('"before" should add a before middleware', () => {
  const handler = middy(() => {});
  const before = () => {};

  handler.before(before);
  expect(handler.__middlewares.before[0]).toEqual(before);
});

test('"after" should add a before middleware', () => {
  const handler = middy(() => {});
  const after = () => {};

  handler.after(after);
  expect(handler.__middlewares.after[0]).toEqual(after);
});

test('"onError" should add a before middleware', () => {
  const handler = middy(() => {});
  const onError = () => {};

  handler.onError(onError);
  expect(handler.__middlewares.onError[0]).toEqual(onError);
});

test("It should execute before and after middlewares in the right order", async () => {
  const handler = middy(() => {
    return { foo: "bar" };
  });

  const executedBefore: any[] = [];
  const executedAfter: any[] = [];

  const m1 = () => ({
    before: () => {
      executedBefore.push("m1");
    },
    after: () => {
      executedAfter.push("m1");
    },
  });

  const m2 = () => ({
    before: () => {
      executedBefore.push("m2");
    },
    after: () => {
      executedAfter.push("m2");
    },
  });

  handler.use(m1()).use(m2());

  // executes the handler
  const response = await handler(null, null, null, null);

  expect(executedBefore).toStrictEqual(["m1", "m2"]);
  expect(executedAfter).toStrictEqual(["m2", "m1"]);
  expect(response).toStrictEqual({ foo: "bar" });
});

test('"before" middlewares should be able to change response', async () => {
  const handler = middy(() => {
    return { foo: "bar" };
  });

  const m: MiddlewareFn = (request) => {
    request.response = { bar: "foo" };
  };

  handler.before(m);

  const res = await handler(null, null, null, null);

  expect(res).toStrictEqual({ bar: "foo" });
});
