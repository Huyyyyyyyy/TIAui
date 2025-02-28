import { createContext } from "react";
import { ConnectedWallet, User } from "@privy-io/react-auth";

export type UserContextType = {
  userData: {
    user: User | null;
    authenticated: boolean;
    ready: boolean;
  };
  walletData: {
    wallet: ConnectedWallet | undefined;
    wallets: ConnectedWallet[];
    privateKey: string;
    walletReady: boolean;
    balance: string;
    faucetStatus: string;
    statusCreateWallet: string;
  };
  transactionData: {
    txSentInfura: string;
    selectedToken: string;
    inputToken: string;
    outputToken: string;
    amountSwap: string;
  };
  userFunction: {
    get: (e: React.FormEvent) => void;
    walletLogout: () => Promise<void>;
  };
  walletFunction: {
    exportWallet: (
      options?:
        | {
            address: string;
          }
        | React.MouseEvent<any, any>
    ) => Promise<void>;
    setPrivateKey: React.Dispatch<React.SetStateAction<string>>;
    connectCurrentWallet: () => Promise<void>;
    importNewWallet: () => Promise<void>;
    getBalance: () => Promise<void>;
    getERC20Balance: (name: string) => Promise<string>;
    faucetUSDC: () => Promise<void>;
    fundUserWallet: (address: string) => Promise<void>;
    setWallet: React.Dispatch<React.SetStateAction<ConnectedWallet>>;
    createAdditionalWallet: () => Promise<void>;
    getTokenByName: (name: string) =>
      | {
          name: string;
          address: string;
          icon: string;
        }
      | undefined;
  };
  transactionFunction: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSwapSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
    setInputToken: React.Dispatch<React.SetStateAction<string>>;
    setOutputToken: React.Dispatch<React.SetStateAction<string>>;
    setAmountSwap: React.Dispatch<React.SetStateAction<string>>;
  };
};

const UserContext = createContext<UserContextType>(undefined!);

export default UserContext;
