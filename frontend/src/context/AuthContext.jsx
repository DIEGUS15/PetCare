import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, verifyTokenRequest, getProfile } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      setIsAuthenticated(true);
      setUser(res.data);

      await getProfileInfo();
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getProfileInfo = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfile(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching profile information: ", error);
      setLoading(false);
      setErrors(
        error.message?.data ||
          (error.message ? [error.message] : ["An unexpected error ocurred"])
      );
    }
  };

  //Limpia automaticamente los errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  //Verifica el token al cargar la aplicación
  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        await getProfileInfo();
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        logout,
        loading,
        user,
        isAuthenticated,
        profile,
        setIsAuthenticated,
        setUser,
        getProfileInfo,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
