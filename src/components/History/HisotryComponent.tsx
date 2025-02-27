import { useContext, useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { getHistory } from "../../apis/user";
import UserContext from "../../context/UserContext";
import { HistoryPayload } from "../../types/user";

const HistoryComponent = () => {
  const {
    userData: { user },
    walletData: {},
    transactionData: {},
    walletFunction: {},
    transactionFunction: {},
  } = useContext(UserContext);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user?.wallet?.address) return;
        const payload: HistoryPayload = {
          address: user?.wallet?.address,
        };
        const response = await getHistory(payload);
        if (response.data.status === 200) {
          setHistory(response.data.data);
        } else {
          setError("Failed to fetch history");
        }
      } catch (err) {
        setError("Error fetching history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <Typography>Loading history...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      {history.map((item, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="body1" fontWeight="bold">
              {item.tx_type}
            </Typography>
            {item.tx_type === "CryptoTransfer" ? (
              <>
                <Typography variant="body2">
                  From: {item.data.sender_address}
                </Typography>
                <Typography variant="body2">
                  To: {item.data.recipient_address}
                </Typography>
                <Typography variant="body2">
                  Amount: {item.data.amount}
                </Typography>
                <Typography variant="body2">
                  Chain: {item.data.chain}
                </Typography>
                <Typography variant="body2">
                  Transaction Hash: {item.data.transaction_hash}
                </Typography>
                <Typography variant="body2">
                  Timestamp:{" "}
                  {new Date(parseInt(item.data.timestamp)).toLocaleString()}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2">
                  Address: {item.data.address}
                </Typography>
                <Typography variant="body2">
                  Swapped: {item.data.amount_in} {item.data.from_token} →{" "}
                  {item.data.to_token}
                </Typography>
                <Typography variant="body2">
                  Transaction Hash: {item.data.transaction_hash}
                </Typography>
                <Typography variant="body2">
                  Timestamp:{" "}
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
