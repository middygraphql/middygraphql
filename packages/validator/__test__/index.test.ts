import middy from "@middygraphql/core";
import validator from "..";
import { z } from "zod";

test("It should validate an incoming object", async () => {
  const handler = middy(({ args }) => {
    return args;
  });

  const argsSchema = z.object({
    input: z.object({
      string: z.string().nonempty(),
      boolean: z.boolean(),
      integer: z.number().int(),
      number: z.number(),
    }),
  });

  handler.use(
    validator({
      argsSchema,
    })
  );

  // invokes the handler
  const args = {
    input: {
      string: JSON.stringify({ foo: "bar" }),
      boolean: true,
      integer: 0,
      number: 0.1,
    },
  };

  const input = await handler({}, args, {}, {});

  expect(input).toStrictEqual(args);
});

test("It should handle invalid schema as a ValidationError", async () => {
  const handler = middy(({ args }) => {
    return args.input;
  });

  const argsSchema = z.object({
    input: z.object({
      string: z.string(),
      boolean: z.boolean(),
      integer: z.number().int(),
      number: z.number(),
    }),
  });

  handler.use(
    validator({
      argsSchema,
    })
  );

  // invokes the handler
  const args = {
    input: {
      string: JSON.stringify({ foo: "bar" }),
      boolean: true,
      integer: 0,
      number: "not a number",
    },
  };

  try {
    await handler({}, args, {}, {});
  } catch (error) {
    expect(error.extensions.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Validation error(s) present. See extensions for more details.");
    expect(error.extensions.details[0].path).toStrictEqual(["input", "number"]);
  }
});

test("It should validate response", async () => {
  const expectedResponse = {
    name: "kyuhak yuk",
    email: "kyuhakyuk@gmail.com",
  };

  const handler = middy(() => {
    return expectedResponse;
  });

  const responseSchema = z.object({
    name: z.string(),
    email: z.string(),
  });

  handler.use(
    validator({
      responseSchema,
    })
  );

  const response = await handler({}, {}, {}, {});

  expect(response).toStrictEqual(expectedResponse);
});

test("It should make requests with invalid responses fail with an ValidationError", async () => {
  const expectedResponse = {
    name: "kyuhak yuk",
    email: "kyuhakyuk@gmail.com",
  };

  const handler = middy(() => {
    return expectedResponse;
  });

  const responseSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  handler.use(
    validator({
      responseSchema,
    })
  );

  expect(handler({}, {}, {}, {})).rejects.toThrowError();
});
