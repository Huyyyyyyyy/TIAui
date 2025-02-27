import { useContext, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { getHistory } from "../../apis/user";
import UserContext from "../../context/UserContext";
import { HistoryPayload } from "../../types/user";

const HistoryComponent = () => {
  const {
    userData: { user },
    walletData: { wallet },
  } = useContext(UserContext);

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!wallet) return;
        const payload: HistoryPayload = {
          address: wallet.address,
        };
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
    <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom color="#ececec">
        History
      </Typography>
      {history.map((item, index) => (
        <Card key={index} sx={{ mb: 2, bgcolor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="body1" fontWeight="bold">
              {item.tx_type}
            </Typography>
            {item.tx_type === "CryptoTransfer" ? (
              <>
                <Typography variant="body2">
                  <strong>From:</strong> {item.data.sender_address}
                </Typography>
                <Typography variant="body2">
                  <strong>To:</strong> {item.data.recipient_address}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount:</strong> {item.data.amount}
                </Typography>
                <Typography variant="body2">
                  <strong>Chain:</strong> {item.data.chain}
                </Typography>
                <Typography variant="body2">
                  <strong>Transaction Hash:</strong>{" "}
                  {item.data.transaction_hash}
                </Typography>
                <Typography variant="body2">
                  <strong>Timestamp:</strong>{" "}
                  {new Date(parseInt(item.data.timestamp)).toLocaleString()}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2">
                  <strong>Address:</strong> {item.data.address}
                </Typography>
                <Typography variant="body2">
                  <strong>Swapped:</strong> {item.data.amount_in}{" "}
                  {item.data.from_token} → {item.data.to_token}
                </Typography>
                <Typography variant="body2">
                  <strong>Transaction Hash:</strong>{" "}
                  {item.data.transaction_hash}
                </Typography>
                <Typography variant="body2">
                  <strong>Timestamp:</strong>{" "}
                  {new Date(parseInt(item.data.timestamp)).toLocaleString()}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HistoryComponent;
