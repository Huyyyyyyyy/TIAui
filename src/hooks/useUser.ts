import { useState } from "react";
import { TUserImport, TUserStatus } from "../types/user";
import { useNavigate } from "react-router";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";

export function useUser() {
  const [status, setStatus] = useState<TUserStatus>("idle");
  const { authenticated, ready, user } = usePrivy();
  const { login, logout, exportWallet } = usePrivy();
  const [userImport, setUserImport] = useState<TUserImport>({
    privateKey: "",
  });
  const [wallet, setWallet] = useState<ConnectedWallet>();
  const { wallets } = useWallets();
  const navigate = useNavigate();

  const getWallet = (address: string) => {
    const wallet = wallets.find((wallet) => wallet.address === address);
    setWallet(wallet);
  };

  //function
  const get = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    login();
    if (ready && authenticated) {
      setStatus("success");
      navigate("/home");
    } else {
      setStatus("error");
    }
  };

  const sendTransaction = async () => {
    
  }

  const handleImportWallet = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserImport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    data: {
      user,
      status,
      authenticated,
      userImport,
      ready,
      wallet,
    },
    functions: {
      handleImportWallet,
      exportWallet,
      getWallet,
      login,
      logout,
      get,
    },
  };
}
