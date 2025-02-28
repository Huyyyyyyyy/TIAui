import { Box } from "@mui/material";

import ImportForm from "../components/Wallet/ImportForm";

const WalletPage = () => {
  return (
    <div
      className="login-form"
      style={{
        padding: "10px 50px",
        minHeight: "100vh",
        backgroundColor: "#1B1B1F",
        paddingTop: "100px",
      }}
    >
      <Box>
        <ImportForm></ImportForm>
      </Box>
    </div>
  );
};

export default WalletPage;
