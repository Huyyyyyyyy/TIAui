import { createContext } from "react";
import { TUserStatus } from "../types/user";
import { ConnectedWallet, LoginModalOptions, User } from "@privy-io/react-auth";
import { InfuraProvider } from "ethers";

export type UserContextType = {
  userData: {
    user: User | null;
    status: TUserStatus;
    authenticated: boolean;
    ready: boolean;
  };
  walletData: {
    wallet: ConnectedWallet | undefined;
    infuraProvider: InfuraProvider;
    privateKey: string;
  };
  transactionData: { txSentInfura: string; selectedToken: string };
  userFunction: {
    get: (e: React.FormEvent) => void;
    login: (e: LoginModalOptions | React.MouseEvent<any, any>) => void;
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
