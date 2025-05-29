import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as auth from "@/lib/services/auth";

// USER
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: auth.getCurrentUser,
    enabled: auth.isAuthenticated(),
  });
};

export const useIsAuthenticated = () => auth.isAuthenticated();

// REGISTER
export const useRegister = () => {
  const mutation = useMutation({ mutationFn: auth.register });
  return {
    register: mutation.mutate,
    registerError: mutation.error,
    isRegistering: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};

// VERIFY
export const useVerify = () => {
  const mutation = useMutation({
    mutationFn: auth.verify,
  });

  return {
    verify: mutation.mutate,
    verifyError: mutation.error,
    isVerifying: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};

// LOGIN
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: auth.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
  });

  return {
    login: mutation.mutate,
    loginError: mutation.error,
    isLoggingIn: mutation.isPending,
  };
};

// LOGOUT
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: auth.logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      router.push("/login");
    },
  });

  return {
    logout: mutation.mutate,
    logoutError: mutation.error,
    isLoggingOut: mutation.isPending,
  };
};

// LOGOUT ALL SESSIONS
export function useLogoutAllSessions() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: auth.revokeAllSessions,
    onSuccess: () => {
      router.push("/login");
    },
  });

  return {
    logoutAllSessions: mutation.mutate,
    isLoggingOut: mutation.isPending,
    logoutError: mutation.error,
  };
}

// SESSIONS
export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: auth.getSessions,
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data,
  });
};

// REVOKE SESSION
export function useRevokeSession() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: auth.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return {
    revokeSession: mutation.mutate,
    revokeSessionError: mutation.error,
    isRevokingSession: mutation.isPending,
  };
}

// PROFILE
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: auth.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data,
  });
};
