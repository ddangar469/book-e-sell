import { createContext, useContext, useEffect, useState } from "react";
import shared from "../utils/shared";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { toast } from "react-toastify";

const initialUserValue = {
  id: 0,
  email: "",
  firstName: "",
  latName: "",
  roleId: 0,
  role: "",
  password: "",
};

const initialValues = {
  user: initialUserValue,
  setUser: () => {},
  logOut: () => {},
};

export const authContext = createContext(initialValues);

export const AuthWrapper = ({ children }) => {
  const [user, _setUser] = useState(initialUserValue);
  const navigate = useNavigate();
  const pathName= useLocation();

  const logOut = () => {
    _setUser(initialUserValue);
    localStorage.removeItem(shared.LocalStorageKeys.USER);
  };

  const setUser = (userDetails) => {
    _setUser(userDetails);
    localStorage.setItem(
      shared.LocalStorageKeys.USER,
      JSON.stringify(userDetails)
    );
  };

  useEffect(() => {
    const existingUser =
      JSON.parse(localStorage.getItem(shared.LocalStorageKeys.USER)) ||
      initialUserValue;

    if (!existingUser.id) {
      navigate(RoutePaths.Login);
    }
    _setUser(existingUser);
  }, []);

  useEffect(()=>{
    if(  !user.id){
         navigate(RoutePaths.Login); 
         console.log(pathName);
      }
    else{
        const hasAccess=shared.hasAccess(pathName,user.roleId);
        if(!hasAccess){
            navigate(RoutePaths.BookListing);
            toast.error("you don't have access of this page");
        }
      }
    
  },[pathName,user])

  return (
    <authContext.Provider value={{ user, setUser, logOut }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(authContext);
};
