// import { set } from "lodash";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  storeId: string;
  setStoreId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storeId, setStoreId] = useState("");

  useEffect(() => {
    // Check for token or other credentials in localStorage
    const token = localStorage.getItem("token");
    // console.log("Token:", token);
    const store_id = localStorage.getItem("store_id");
    if (store_id) {
      setStoreId(store_id);
    }
    // console.log("Store ID:", store_id);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    // Assuming token or other relevant data is stored in localStorage on login
  };

  const logout = () => {
    localStorage.removeItem("token"); // Ensure to clear the token on logout
    localStorage.removeItem("store_id"); // Clear store_id on logout
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, storeId, setStoreId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
