import RegisterSchema from "@/zod/auth/register.schema";
import LoginSchema from "@/zod/auth/login.schema";
import ForgotPasswordSchema from "@/zod/auth/forgot-password.schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export const useRegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  return {
    register,
    handleSubmit,
    watch,
    getValues,
    errors,
    setValue,
  };
};

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  return {
    register,
    handleSubmit,
    errors,
    setValue,
  };
};

export const useForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  return {
    register,
    handleSubmit,
    errors,
    setValue,
  };
};
