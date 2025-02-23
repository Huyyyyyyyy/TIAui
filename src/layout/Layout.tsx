import { Outlet } from "react-router";

import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { useUser } from "../hooks/useUser";
import UserContext, { UserContextType } from "../context/UserContext";

const Layout = () => {
  const currentUser: UserContextType = useUser();
  return (
    <>
      <UserContext.Provider value={currentUser}>
        <Header />
        <Outlet />
      </UserContext.Provider>
      <Footer />
    </>
  );
};

export default Layout;
