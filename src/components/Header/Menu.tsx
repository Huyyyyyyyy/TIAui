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
    userData: { user, authenticated, ready },
    userFunction: { get, walletLogout },
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
      <Button {...styleButton} onClick={walletLogout}>
        Disconnect
      </Button>
    </>
  ) : (
    <>
      <Link to={"/home"}>
        <Button {...styleButton}>Home</Button>
      </Link>
      <Button {...styleButton} onClick={get}>
        Sign in
      </Button>
    </>
  );
};

export default Menu;
