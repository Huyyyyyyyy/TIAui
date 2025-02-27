export type TUser = {
  email: string;
};

export type TCryptoTransferData = {
  transaction_hash: string;
  sender_address: string;
  recipient_address: string;
  amount: string;
  chain: string;
  timestamp: string;
};

export type TSwapData = {
  transaction_hash: string;
  address: string;
  amount_in: string;
  from_token: string;
  to_token: string;
  timestamp: string;
};

export type HistoryPayload = {
  address: string;
};

export type TransactionPayload =
  | { tx_type: "CryptoTransfer"; data: TCryptoTransferData }
  | { tx_type: "Swap"; data: TSwapData };

export type TransactionRecord =
  | { tx_type: "CryptoTransfer"; data: TCryptoTransferData }
  | { tx_type: "Swap"; data: TSwapData };

export type TokenBalance = {
  [key: string]: string;
};

export type FaucetUsdcPayload = {
  amount: string;
  chain: "ETH";
  destination_address: string;
};
