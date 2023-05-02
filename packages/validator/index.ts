import { Request } from '@middygraphql/core'
import { ValidationError } from '@middygraphql/error'
import { z } from 'zod'

type Schemas = {
  argsSchema?: z.ZodSchema<any>
  contextSchema?: z.ZodSchema<any>
  responseSchema?: z.ZodSchema<any>
  infoSchema?: z.ZodSchema<any>
}

export default function validator(schemas: Schemas) {
  const { argsSchema, contextSchema, responseSchema, infoSchema } = schemas

  async function before(request: Request) {
    if (argsSchema) {
      try {
        argsSchema.parse(request.args)
      } catch (error: any) {
        throw new ValidationError(
          'Validation error(s) present. See extensions for more details.',
          {
            extensions: {
              details: error.issues,
            },
          }
        )
      }
    }

    if (infoSchema) {
      try {
        infoSchema.parse(request.info)
      } catch (error: any) {
        throw new ValidationError(
          'Validation error(s) present. See extensions for more details.',
          {
            extensions: {
              details: error.issues,
            },
          }
        )
      }
    }

    if (contextSchema) {
      try {
        contextSchema.parse(request.context)
      } catch (error: any) {
        throw new ValidationError(
          'Validation error(s) present. See extensions for more details.',
          {
            extensions: {
              details: error.issues,
            },
          }
        )
      }
    }
  }

  async function after(request: Request) {
    if (responseSchema) {
      try {
        responseSchema.parse(request.response)
      } catch (error: any) {
        // Should be enough to just throw the error here, but we'll see
        // if we need to do something else later.
        throw new Error(error)
      }
    }
  }

  return {
    before,
    after,
  }
}
