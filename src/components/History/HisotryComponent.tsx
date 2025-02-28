import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { getHistory } from "../../apis/user";
import UserContext from "../../context/UserContext";
import { HistoryPayload } from "../../types/user";

const HistoryComponent = () => {
  const {
    userData: { user },
    walletData: { wallet },
    walletFunction: { getTokenByName },
  } = useContext(UserContext);

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!wallet) return;
        const payload: HistoryPayload = { address: wallet.address };
        const response = await getHistory(payload);
        if (response.data.status === 200) {
          setHistory(response.data.data);
        } else {
          setError("Failed to fetch history");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, wallet]);

  if (loading)
    return <Typography color="#ececec">Loading history...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom color="#ececec" textAlign="center">
        YOUR HISTORIES
      </Typography>
      <Box sx={{ maxHeight: 400, overflowY: "auto", margin: "auto", p: 2 }}>
        {history.map((item, index) => {
          // For a transfer transaction
          if (item.tx_type === "CryptoTransfer" && item.data.sender_address) {
            const token = getTokenByName(item.data.chain);
            return (
              <Card key={index} sx={{ mb: 2, bgcolor: "#ececec" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Column 1: Icon */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      {token ? (
                        <img
                          src={token.icon}
                          alt={token.name}
                          style={{ width: "30%", borderRadius: "50%" }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </Box>
                    {/* Column 2: Date and Tx Hash with recipient address below */}
                    <Box sx={{ flex: 2, textAlign: "center" }}>
                      <Typography variant="body2">
                        {new Date(
                          parseInt(item.data.timestamp)
                        ).toLocaleString()}
                      </Typography>
                      <MuiLink
                        href={`https://sepolia.etherscan.io/tx/${item.data.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ fontSize: 13, display: "block", mt: 0.5 }}
                      >
                        Details : {item.data.transaction_hash.substring(0, 20)}
                        ...
                      </MuiLink>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        To: {item.data.recipient_address.substring(0, 20)}...
                      </Typography>
                    </Box>
                    {/* Column 3: Amount */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.data.amount} {item.data.chain}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          }
          // For a swap transaction (or any transaction with from_token defined)
          else if (item.tx_type === "Swap" || item.data.from_token) {
            const fromToken = getTokenByName(item.data.from_token);
            const toToken = getTokenByName(item.data.to_token);
            return (
              <Card key={index} sx={{ mb: 2, bgcolor: "#ececec" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Column 1: From and To Icons with an arrow in between */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      {fromToken ? (
                        <img
                          src={fromToken.icon}
                          alt={fromToken.name}
                          style={{ width: "30%", borderRadius: "50%" }}
                        />
                      ) : (
                        "N/A"
                      )}

                      {toToken ? (
                        <img
                          src={toToken.icon}
                          alt={toToken.name}
                          style={{ width: "30%", borderRadius: "50%" }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </Box>
                    {/* Column 2: Date and Tx Hash */}
                    <Box sx={{ flex: 2, textAlign: "center" }}>
                      <Typography variant="body2">
                        {new Date(
                          parseInt(item.data.timestamp)
                        ).toLocaleString()}
                      </Typography>
                      <MuiLink
                        href={`https://sepolia.etherscan.io/tx/${item.data.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ fontSize: 13, display: "block", mt: 0.5 }}
                      >
                        Details : {item.data.transaction_hash.substring(0, 20)}
                        ...
                      </MuiLink>
                    </Box>
                    {/* Column 3: Swap Amount Details */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.data.amount_in} {item.data.from_token}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          } else {
            return (
              <Card key={index} sx={{ mb: 2, bgcolor: "#f5f5f5" }}>
                <CardContent>
                  <Typography variant="body2">
                    Unknown transaction type
                  </Typography>
                </CardContent>
              </Card>
            );
          }
        })}
      </Box>
    </Box>
  );
};

export default HistoryComponent;
