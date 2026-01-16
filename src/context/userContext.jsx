import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: "",
    testid: "",
    email: "",
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook (BEST PRACTICE)
export const useUser = () => useContext(UserContext);
