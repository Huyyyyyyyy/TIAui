import { Box } from "@mui/material";

import ImportForm from "../components/Wallet/ImportForm";

const WalletPage = () => {
  return (
    <div
      className="login-form"
      style={{ padding: "10px 50px", minHeight: "800px" }}
    >
      <Box>
        <ImportForm></ImportForm>
      </Box>
    </div>
  );
};

export default WalletPage;
