import { z } from "zod";

export const projectSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    year: z.string().optional(),
    demo: z
      .string()
      .url("Demo must be a valid URL")
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url("GitHub must be a valid URL")
      .optional()
      .or(z.literal("")),
    status: z
      .enum(["TODO", "PROGRESS", "ON_HOLD", "FINISHED"], {
        errorMap: () => ({ message: "Invalid status" }),
      })
      .optional(),
    isSelected: z.string().optional(),
    isHidden: z
      .string()
      .optional()
      .transform(val => (val === "true" ? false : true)),
    stacks: z
      .string()
      .optional()
      .transform(val => (val ? val.split(",") : [])),
  })
  .passthrough();

export const taskSchema = z
  .object({
    note: z.string().min(1, "Note is required"),
    status: z
      .enum(["TODO", "PROGRESS", "DONE"], {
        errorMap: () => ({ message: "Invalid task status" }),
      })
      .optional(),
    project: z.string().optional(),
  })
  .passthrough();

export const skillSchema = z
  .object({
    skillName: z.string().min(1, "Skill name is required"),
    order: z
      .string()
      .regex(/^\d+$/, "Order must be a number")
      .transform(Number)
      .optional(),
  })
  .passthrough();

export const signInSchema = z
  .object({
    email: z
      .string()
      .min(1, "Enter your email address")
      .email("Invalid email format"),
    password: z.string().min(1, "Enter your password"),
  })
  .passthrough();

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Enter your email address")
      .email("Invalid email format"),
    password: z.string().min(5, "Password should be at least 5 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .passthrough()
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(5, "Password should be at least 5 chars long"),
    newPassword2: z.string().min(1, "Enter verify password"),
  })
  .passthrough()
  .refine(data => data.newPassword === data.newPassword2, {
    message: "Verify password have to match!",
    path: ["newPassword2"],
  });
