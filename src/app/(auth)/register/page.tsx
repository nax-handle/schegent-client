"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Otp from "@/components/auth/otp";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterSchema from "@/zod/register.schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "@/lib/services/auth";

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function CreateAccount() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

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

  const emailValue = watch("email");

  useEffect(() => {
    if (emailValue && emailValue.includes("@") && !emailValue.includes(".")) {
      const [local, domain] = emailValue.split("@");
      if (domain === "") {
        setValue("email", `${local}@gmail.com`);
      }
    }
  }, [emailValue]);

  // const password = watch("password");
  // const confirmPassword = watch("confirmPassword");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
    onSuccess: () => {
      console.log("Registration successful");
      setStep(2);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-md mx-auto p-6 backdrop-blur-2xl bg-gray-200/20 border-1 rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2e2e77] dark:text-[#8989d1]">
            {step === 1 ? t("Create Your Account") : t("Verify Your Email")}
          </h1>
          {step === 2 && (
            <p className="text-sm text-gray-500 mt-2">
              {t("We've sent a verification code to")} {emailValue}
            </p>
          )}
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            {/* Google Signup */}
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-500 font-medium">
                {t("Sign Up with Google")}
              </span>
            </Button>

            {/* OR line */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full absolute"></div>
              <span className="px-4 text-sm text-gray-400 dark:bg-[#363637] bg-[#FAFAFB] relative">
                {t("OR")}
              </span>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder={t("Your Email")}
                  {...register("email")}
                  maxLength={30}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && !value.includes("@")) {
                      setValue("email", `${value}@gmail.com`);
                    }
                  }}
                  className="pl-10 py-6 border-[#e0e0f2] rounded-xl focus-visible:ring-blue-500"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 pl-3">
                  {t(`${errors.email.message}`)}
                </p>
              )}

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  maxLength={20}
                  placeholder={t("Password")}
                  {...register("password")}
                  className="pl-10 pr-10 py-6 border-[#e0e0f2] rounded-xl focus-visible:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 pl-3">
                  {t(`${errors.password.message}`)}
                </p>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  maxLength={20}
                  placeholder={t("Confirm Password")}
                  {...register("confirmPassword")}
                  className={`pl-10 pr-10 py-6 border-[#e0e0f2] rounded-xl focus-visible:ring-blue-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 pl-3">
                  {t(`${errors.confirmPassword.message}`)}
                </p>
              )}

              {errors?.root && (
                <p className="text-xs text-red-500 pl-3">
                  {errors.root.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 bg-[#3e41f7] hover:bg-[#5355d1] text-white rounded-xl"
              >
                {isPending ? t("Loading...") : t("Continue")}
              </Button>
              {error && (
                <p className="text-xs text-red-500 pl-3 text-center">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong"}
                </p>
              )}
            </form>

            <p className="text-center text-gray-400 text-sm">
              {t("Already have an account")}?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                {t("LogIn")}
              </Link>
            </p>
          </div>
        ) : (
          <Otp setStep={setStep} email={getValues} />
        )}
      </div>
    </div>
  );
}
