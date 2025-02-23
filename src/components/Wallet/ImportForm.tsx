import { useContext } from "react";
import { Form, Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import UserContext from "../../context/UserContext";
import { CommonProps } from "@mui/material/OverridableComponent";
const styleText: CommonProps = {
  style: {
    color: "#FFFFF5DB",
    outline: "none",
  },
};
const ImportForm = () => {
  const {
    data: { status, authenticated, ready, userImport, user, wallet },
    functions: { get, handleImportWallet, exportWallet, getWallet },
  } = useContext(UserContext);

  return !user?.wallet?.address ? (
    <>
      <h1>Sign in</h1>
      <Form onSubmit={get}>
        <TextField
          id="outlined-basic password-input"
          label="Password"
          variant="outlined"
          name="privateKey"
          value={userImport?.privateKey}
          type="password"
          onChange={handleImportWallet}
        />
        <Button
          type="submit"
          disabled={
            userImport?.privateKey === "" || status === "loading" ? true : false
          }
        >
          {status === "loading" ? "Loading..." : "Sign in"}
        </Button>
      </Form>
    </>
  ) : (
    <>
      <p>{wallet ? wallet.address : ""}</p>
      <Button
        {...styleText}
        disabled={wallet ? true : false}
        onClick={async () => {
          user.wallet?.address ? getWallet(user.wallet?.address) : {};
        }}
      >
        Get Your Wallet
      </Button>
    </>
  );
};

export default ImportForm;
