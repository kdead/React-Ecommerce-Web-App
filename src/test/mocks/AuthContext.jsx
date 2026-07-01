import { createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const MockAuthProvider = ({ children, user = null }) => (
  <AuthContext.Provider
    value={{
      currentUser: user,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    }}
  >
    {children}
  </AuthContext.Provider>
);
