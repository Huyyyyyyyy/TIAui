import { createContext } from "react";
import { TUserImport, TUserStatus } from "../types/user";
import { ConnectedWallet, LoginModalOptions, User } from "@privy-io/react-auth";

export type UserContextType = {
  data: {
    user: User | null;
    status: TUserStatus;
    userImport: TUserImport;
    authenticated: boolean;
    ready: boolean;
    wallet: ConnectedWallet | undefined;
  };
  functions: {
    get: (e: React.FormEvent) => void;
    handleImportWallet: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    exportWallet: (
      options?:
        | {
            address: string;
          }
        | React.MouseEvent<any, any>
    ) => Promise<void>;
    getWallet: (address: string) => void;
    login: (e: LoginModalOptions | React.MouseEvent<any, any>) => void;
    logout: () => Promise<void>;
  };
};

const UserContext = createContext<UserContextType>(undefined!);

export default UserContext;
