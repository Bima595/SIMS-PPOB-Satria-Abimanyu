import { z } from "zod"

export const LoginDtoSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const RegisterDtoSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type LoginDto = z.infer<typeof LoginDtoSchema>
export type RegisterDto = z.infer<typeof RegisterDtoSchema>

