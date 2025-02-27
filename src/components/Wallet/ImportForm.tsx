import { useContext, useEffect, useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import UserContext from "../../context/UserContext";
import { TOKEN } from "../../const/const";
import { TokenBalance } from "../../types/user";

const styleText = {
  style: {
    color: "#FFFFF5DB",
    outline: "none",
    backgroundColor: "#A8B1FF",
  },
};

const TransferSwapPanel = () => {
  const {
    userData: { ready, authenticated, user },
    walletData: { wallet, privateKey, walletReady, balance, faucetStatus },
    transactionData: { selectedToken, inputToken, outputToken },
    walletFunction: {
      setPrivateKey,
      connectCurrentWallet,
      importNewWallet,
      getBalance,
      getERC20Balance,
      faucetUSDC,
      fundUserWallet,
    },
    transactionFunction: {
      handleSubmit,
      setSelectedToken,
      handleSwapSubmit,
      setInputToken,
      setOutputToken,
      setAmountSwap,
    },
  } = useContext(UserContext);

  // State to control which form to display: "transfer" or "swap"
  const [tabValue, setTabValue] = useState("transfer");
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    USDC: "0",
    LINK: "0",
    WETH: "0",
  });

  useEffect(() => {
    if (authenticated && ready && walletReady) {
      getBalance();
      const fetchTokenBalances = async () => {
        try {
          // Call your custom getERC20Balance for each token
          const usdcBalance = await getERC20Balance("USDC");
          const linkBalance = await getERC20Balance("LINK");
          const wethBalance = await getERC20Balance("WETH");

          // Update state with the retrieved balances
          setTokenBalance({
            USDC: usdcBalance,
            LINK: linkBalance,
            WETH: wethBalance,
          });
        } catch (error) {
          console.error("Error fetching token balances:", error);
        }
      };
      fetchTokenBalances();
    }
  }, [wallet, ready, walletReady, authenticated, getBalance, faucetStatus]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

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
    <Box sx={{ display: "flex", gap: 2, maxWidth: 900, margin: "auto", p: 2 }}>
      {/* Left Side: Balance & Actions */}
      <Box
        sx={{
          width: "40%",
          bgcolor: "#1e1e2f",
          borderRadius: 2,
          p: 2,
          color: "white",
          height: "fit-content",
        }}
      >
        <Typography variant="h6">Your Balances</Typography>
        {TOKEN.map((token) => (
          <Card key={token.address} sx={{ mb: 2, bgcolor: "#2e2e3f" }}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <img
                  src={token.icon}
                  alt={token.name}
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%" }}
                />
              </ListItemIcon>
              <Typography color="#ececec" variant="body1" sx={{ ml: 1 }}>
                {token.name}
              </Typography>
              {/* For demonstration, we display balance only for ETH. Extend as needed. */}
              {token.name === "ETH" && (
                <Typography
                  fontSize={17}
                  color="#ececec"
                  variant="body2"
                  sx={{ ml: "auto" }}
                >
                  {(+balance).toFixed(2)} ETH
                </Typography>
              )}
              {token.name !== "ETH" && (
                <Typography
                  fontSize={17}
                  color="#ececec"
                  variant="body2"
                  sx={{ ml: "auto" }}
                >
                  {(tokenBalance as TokenBalance)[token.name] || "0"}{" "}
                  {token.name}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
        <Button
          {...styleText}
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1 }}
          onClick={faucetUSDC}
        >
          {faucetStatus === "loading" ? "Processing..." : "Faucet (Get 5 USDC)"}
        </Button>
        <Button
          {...styleText}
          fullWidth
          variant="contained"
          onClick={() => fundUserWallet(wallet.address)}
        >
          FUND
        </Button>
      </Box>
      {/* Right Side: Transfer and Swap Forms with Toggle */}
      <Box
        sx={{
          width: "60%",
          bgcolor: "#1e1e2f",
          borderRadius: 2,
          p: 2,
          color: "white",
        }}
      >
        <Typography variant="h6" fontSize={14}>
          id: {user?.id}
        </Typography>
        <Typography variant="h6">
          Address :{wallet.address.substring(0, 30)}...
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ mt: 2 }}
        >
          <Tab label="Transfer" value="transfer" />
          <Tab label="Swap" value="swap" />
        </Tabs>
        {tabValue === "transfer" && (
          <Box sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Select
                fullWidth
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, bgcolor: "#ececec" }}
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
                sx={{ mb: 2, bgcolor: "#ececec" }}
              />
              <TextField
                fullWidth
                type="text"
                name="amount"
                label="Amount"
                variant="outlined"
                sx={{ mb: 2, bgcolor: "#ececec" }}
              />
              <Button
                fullWidth
                {...styleText}
                type="submit"
                variant="contained"
              >
                SEND
              </Button>
            </form>
          </Box>
        )}
        {tabValue === "swap" && (
          <Box sx={{ mt: 2 }}>
            <form onSubmit={handleSwapSubmit}>
              <Select
                fullWidth
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, bgcolor: "#ececec" }}
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
              <Select
                fullWidth
                value={outputToken}
                label="Amount"
                onChange={(e) => setOutputToken(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, bgcolor: "#ececec" }}
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
                onChange={(e) => setAmountSwap(e.target.value)}
                label="Amount"
                variant="outlined"
                sx={{ mb: 2, bgcolor: "#ececec" }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 1 }}
                {...styleText}
              >
                SWAP{" "}
              </Button>
            </form>{" "}
          </Box>
        )}{" "}
      </Box>{" "}
    </Box>
  );
};
export default TransferSwapPanel;
