import { useContext } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  InputLabel,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import UserContext from "../../context/UserContext";
import { TOKEN } from "../../const/const";

const styleText = {
  style: {
    color: "#FFFFF5DB",
    outline: "none",
    backgroundColor: "#A8B1FF",
  },
};

const ImportForm = () => {
  const {
    userData: { ready, authenticated },
    walletData: { wallet, privateKey, walletReady },
    transactionData: {
      txSentInfura,
      selectedToken,
      inputToken,
      outputToken,
      amountSwap,
    },
    walletFunction: { setPrivateKey, connectCurrentWallet, importNewWallet },
    transactionFunction: {
      handleSubmit,
      setSelectedToken,
      handleSwapSubmit,
      setInputToken,
      setOutputToken,
      setAmountSwap,
    },
  } = useContext(UserContext);

  return !wallet?.address ? (
    <Box
      sx={{
        p: 3,
        bgcolor: "#1e1e2f",
        borderRadius: 2,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      {walletReady ? (
        <Box>
          <TextField
            fullWidth
            type="text"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your private key"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "#A8B1FF" }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={importNewWallet}
            disabled={!authenticated || !ready}
          >
            Import New Wallet
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={connectCurrentWallet}
            disabled={!authenticated || !ready}
          >
            Connect Current Wallet
          </Button>
        </Box>
      ) : (
        <Typography color="error">Wallet is not ready</Typography>
      )}
    </Box>
  ) : (
    <Box
      sx={{
        p: 3,
        bgcolor: "#1e1e2f",
        borderRadius: 2,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      <Typography variant="h6" color="white">
        Wallet Address: {wallet.address}
      </Typography>
      {/* Send Token Form */}
      <Typography variant="h6" sx={{ mt: 3, color: "white" }}>
        Send Token
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputLabel sx={{ color: "white" }}>Select Asset:</InputLabel>
        <Select
          fullWidth
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          variant="outlined"
          sx={{ mb: 2, bgcolor: "#A8B1FF" }}
        >
          {TOKEN.map((token) => (
            <MenuItem key={token.address} value={token.name}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <img
                    src={token.icon}
                    alt={token.name}
                    width={24}
                    height={24}
                    style={{ borderRadius: "50%" }}
                  />
                </ListItemIcon>
                <ListItemText primary={token.name} />
              </Box>
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          type="text"
          name="recipient"
          label="Recipient Address"
          variant="outlined"
          sx={{ mb: 2, bgcolor: "#A8B1FF" }}
        />
        <TextField
          fullWidth
          type="text"
          name="amount"
          label="Amount"
          variant="outlined"
          sx={{ mb: 2, bgcolor: "#A8B1FF" }}
        />
        <Button fullWidth {...styleText} type="submit" variant="contained">
          SEND
        </Button>
      </form>
      <Typography color="success.main" sx={{ mt: 2 }}>
        {txSentInfura}
      </Typography>
      {/* Swap Token Form */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Swap Tokens
        </Typography>
        <form onSubmit={handleSwapSubmit}>
          <InputLabel sx={{ color: "white" }}>From</InputLabel>
          <Select
            fullWidth
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            variant="outlined"
            sx={{ mb: 2, bgcolor: "#A8B1FF" }}
          >
            {TOKEN.map((token) => (
              <MenuItem key={token.address} value={token.name}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <img
                      src={token.icon}
                      alt={token.name}
                      width={24}
                      height={24}
                      style={{ borderRadius: "50%" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={token.name} />
                </Box>
              </MenuItem>
            ))}
          </Select>
          <InputLabel sx={{ color: "white" }}>To</InputLabel>
          <Select
            fullWidth
            value={outputToken}
            onChange={(e) => setOutputToken(e.target.value)}
            variant="outlined"
            sx={{ mb: 2, bgcolor: "#A8B1FF" }}
          >
            {TOKEN.map((token) => (
              <MenuItem key={token.address} value={token.name}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <img
                      src={token.icon}
                      alt={token.name}
                      width={24}
                      height={24}
                      style={{ borderRadius: "50%" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={token.name} />
                </Box>
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            type="number"
            value={amountSwap}
            onChange={(e) => setAmountSwap(Number(e.target.value))}
            label="Amount"
            variant="outlined"
            sx={{ mb: 2, bgcolor: "#A8B1FF" }}
          />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 1 }}>
            Swap Tokens{" "}
          </Button>
        </form>{" "}
      </Box>{" "}
    </Box>
  );
};
export default ImportForm;
