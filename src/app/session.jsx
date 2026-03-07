import { createContext, useContext, useEffect, useState } from "react";

import { getSessionSnapshot } from "./api";

const SessionContext = createContext(null);

const mockModeEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_SESSION === "true";

function buildMockSession(role) {
  const isAdmin = role === "admin";

  return {
    session: {
      id: `mock-${role}-session`,
      expiresAt: "2099-01-01T00:00:00.000Z",
    },
    user: {
      id: `mock-${role}`,
      name: isAdmin ? "Dana Holloway" : "Sonia Patel",
      email: isAdmin ? "ops@carfinance.local" : "sonia@carfinance.local",
      role,
      isAdmin,
    },
  };
}

function resolveRole(user) {
  if (!user) {
    return null;
  }

  if (user.role === "admin" || user.isAdmin === true) {
    return "admin";
  }

  if (Array.isArray(user.roles) && user.roles.includes("admin")) {
    return "admin";
  }

  return "customer";
}

export function SessionProvider({ children }) {
  const [sessionData, setSessionData] = useState({
    session: null,
    user: null,
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [previewRole, setPreviewRole] = useState(
    mockModeEnabled ? import.meta.env.VITE_MOCK_ROLE ?? null : null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function bootstrapSession() {
      setStatus("loading");
      setError(null);

      if (mockModeEnabled && previewRole) {
        if (!isActive) {
          return;
        }

        setSessionData(buildMockSession(previewRole === "admin" ? "admin" : "customer"));
        setStatus("ready");
        return;
      }

      try {
        const payload = await getSessionSnapshot();

        if (!isActive) {
          return;
        }

        setSessionData({
          session: payload.session ?? null,
          user: payload.user ?? null,
        });
        setStatus("ready");
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setSessionData({
          session: null,
          user: null,
        });
        setStatus("error");
        setError(caughtError instanceof Error ? caughtError.message : "Unknown session error.");
      }
    }

    void bootstrapSession();

    return () => {
      isActive = false;
    };
  }, [previewRole, refreshKey]);

  async function refreshSession() {
    setRefreshKey((currentKey) => currentKey + 1);
  }

  function enablePreview(role) {
    if (!mockModeEnabled) {
      return;
    }

    setPreviewRole(role === "admin" ? "admin" : "customer");
  }

  function clearPreview() {
    if (!mockModeEnabled) {
      return;
    }

    setPreviewRole(null);
  }

  const role = resolveRole(sessionData.user);

  return (
    <SessionContext.Provider
      value={{
        ...sessionData,
        role,
        status,
        error,
        refreshSession,
        enablePreview,
        clearPreview,
        mockModeEnabled,
        isPreviewSession: mockModeEnabled && Boolean(previewRole),
        isAuthenticated: Boolean(sessionData.user),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }

  return context;
}
