import { Button } from "@mui/material";
import { CommonProps } from "@mui/material/OverridableComponent";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

const styleButton: CommonProps = {
  style: {
    color: "#FFFFF5DB",
    textTransform: "capitalize",
    outline: "none",
  },
};

const Menu = () => {
  const {
    data: { user, authenticated, ready },
    functions: { login, logout },
  } = useContext(UserContext);

  return authenticated && ready ? (
    <>
      <Link to={"/home"}>
        <Button {...styleButton}>Home</Button>
      </Link>
      <Link to={"/wallet"}>
        <Button {...styleButton}>Wallet</Button>
      </Link>
      <Button {...styleButton}>
        {user?.wallet?.address.substring(0, 10)}...
      </Button>
      <Button {...styleButton} onClick={logout}>
        Disconnect
      </Button>
    </>
  ) : (
    <>
      <Link to={"/home"}>
        <Button {...styleButton}>Home</Button>
      </Link>
      <Button {...styleButton} onClick={login}>
        Sign in
      </Button>
    </>
  );
};

export default Menu;
