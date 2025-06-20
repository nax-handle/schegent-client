import { z } from "zod";

const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .transform((val) => {
        if (!val.includes("@")) {
          return `${val}@gmail.com`;
        }
        return val;
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default RegisterSchema;
