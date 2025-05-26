import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as auth from "@/lib/services/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: auth.getCurrentUser,
    enabled: auth.isAuthenticated(),
  });

  const register = useMutation({
    mutationFn: auth.register,
    onSuccess: (data, variables) => {},
  });

  const verify = useMutation({
    mutationFn: auth.verify,
    onSuccess: () => {
      router.push("/login");
    },
  });

  const login = useMutation({
    mutationFn: auth.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/calendar");
    },
  });

  const logout = useMutation({
    mutationFn: auth.logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      router.push("/login");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: auth.isAuthenticated(),
    register: register.mutate,
    verify: verify.mutate,
    login: login.mutate,
    logout: logout.mutate,
    registerError: register.error,
    verifyError: verify.error,
    loginError: login.error,
    logoutError: logout.error,
    isRegistering: register.isPending,
    isVerifying: verify.isPending,
    isLoggingIn: login.isPending,
    isLoggingOut: logout.isPending,
  };
}
