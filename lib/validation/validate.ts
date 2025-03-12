import { z } from "zod"

export type ValidationResult<T> = {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
}

export async function validateDto<T>(schema: z.ZodType<T>, data: unknown): Promise<ValidationResult<T>> {
  try {
    const validData = await schema.parseAsync(data)
    return {
      success: true,
      data: validData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}

      error.errors.forEach((err) => {
        const path = err.path.join(".")
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })

      return {
        success: false,
        errors,
      }
    }

    return {
      success: false,
      errors: {
        _form: ["An unexpected error occurred"],
      },
    }
  }
}

export function getFirstError(errors: Record<string, string[]> | undefined, field: string): string | undefined {
  if (!errors || !errors[field] || errors[field].length === 0) {
    return undefined
  }

  return errors[field][0]
}

