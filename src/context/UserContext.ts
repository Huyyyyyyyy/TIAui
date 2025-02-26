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
  transactionData: { txSentInfura: string; selectedToken: string };
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
    setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
  };
};

const UserContext = createContext<UserContextType>(undefined!);

export default UserContext;
