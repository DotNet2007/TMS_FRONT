"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";

// =========================================
// USER TYPE
// Represents the authenticated user's profile and JWT claims.
// =========================================
export interface User {
  id?: string | number;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;

  // Standard JWT claims
  exp?: number;
  iat?: number;
  sub?: string;

  memberships?: { teamId: string, teamName: string }[] | null;

  // Additional properties returned by the API
  [key: string]: unknown;
}

// export interface IRole {
//   code: string;
//   name: string;
// }

// =========================================
// AUTH CONTEXT TYPE
// Defines the authentication state and available actions.
// =========================================
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

// =========================================
// API RESPONSE TYPES
// The /me endpoint may return the user directly
// or return an object containing a user property.
// =========================================
type MeResponse = User | { user: User };

// Validate that a value is an object representing a user.
function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.fullName === "string" ||
    typeof candidate.name === "string" ||
    typeof candidate.email === "string" ||
    typeof candidate.id === "string" ||
    typeof candidate.id === "number"
  );
}

type DecodedUser = User & {
  exp?: number;
  iat?: number;
};

// =========================================
// AUTH CONTEXT
// Provides authentication data to the application.
// =========================================
const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const TOKEN_KEY = "userToken";

// =========================================
// AUTH PROVIDER
// Restores the authenticated user's profile on page load.
// =========================================
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // =========================================
  // RESTORE USER SESSION
  // 1. Read the saved JWT.
  // 2. Check token expiration.
  // 3. Fetch the user's current profile from the API.
  // 4. Update the authentication state.
  // =========================================
  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        // No saved token means there is no restored session.
        if (!token) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        // Decode the JWT to check its expiration.
        const decoded = jwtDecode<DecodedUser>(token);

        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
          localStorage.removeItem(TOKEN_KEY);

          if (isMounted) {
            setUser(null);
          }
          return;
        }

        // Build the backend base URL.
        const apiUrl = (
          process.env.NEXT_PUBLIC_API_URL ??
          "http://localhost:5000/api"
        ).replace(/\/$/, "");

        // Request the authenticated user's profile.
        const response = await axios.get<MeResponse>(
          `${apiUrl}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",

            },
          }
        );

        const responseData = response.data;

        // Support both { user: {...} } and direct user responses.
        // Check whether the API response contains a nested user object.
        const apiUser: User =
          "user" in responseData &&
          isUser(responseData.user)
            ? responseData.user
            : responseData;

        // Normalize the display name returned by the backend.
        const fullName =
          typeof apiUser.fullName === "string"
            ? apiUser.fullName.trim()
            : typeof apiUser.name === "string"
              ? apiUser.name.trim()
              : "";

        // Merge JWT claims with the current user profile.
        const authenticatedUser: User = {
          ...decoded,
          ...apiUser,
          fullName,
        };

        if (isMounted) {
          setUser(authenticatedUser);
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);

        if (isMounted) {
          setUser(null);
        }

        // Clear the token if the API rejects it as unauthorized.
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void checkToken();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================
  // LOGIN
  // Updates the current user's profile after successful login.
  // The login page is responsible for saving the access token.
  // =========================================
  const login = (userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  // =========================================
  // LOGOUT
  // Clears local session data.
  // =========================================  
  const logout = async () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };


  // =========================================
  // CONTEXT VALUE
  // Exposes the user, loading state, and authentication actions.
  // =========================================
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================================
// USE AUTH
// Allows components to access the authentication context.
// =========================================
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
