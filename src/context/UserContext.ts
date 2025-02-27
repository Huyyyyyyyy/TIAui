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
    privateKey: string;
    walletReady: boolean;
  };
  transactionData: {
    txSentInfura: string;
    selectedToken: string;
    inputToken: string;
    outputToken: string;
    amountSwap: number;
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
  };
  transactionFunction: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSwapSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
    setInputToken: React.Dispatch<React.SetStateAction<string>>;
    setOutputToken: React.Dispatch<React.SetStateAction<string>>;
    setAmountSwap: React.Dispatch<React.SetStateAction<number>>;
  };
};

const UserContext = createContext<UserContextType>(undefined!);

export default UserContext;
