import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ConnectedWallet,
  useImportWallet,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { ethers, InfuraProvider, TransactionRequest } from "ethers";
import {
  CHAIN_ID,
  ERC20_ABI,
  INFURA_API_KEY,
  NETWORK,
  TOKEN,
} from "../const/const";

export function useUser() {
  //user
  const { authenticated, ready, user } = usePrivy();
  const { login, logout } = usePrivy();

  //walet
  const { wallets, ready: walletReady } = useWallets();
  const [wallet, setWallet] = useState<ConnectedWallet>(wallets[0]);
  const { exportWallet } = usePrivy();
  const { importWallet } = useImportWallet();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [infuraProvider] = useState<InfuraProvider>(
    new ethers.InfuraProvider(NETWORK, INFURA_API_KEY)
  );

  //transaction data
  const [txSentInfura] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState(TOKEN[0].address);

  //navigate
  const navigate = useNavigate();

  //user function
  const get = () => {
    login();
  };

  const walletLogout = async () => {
    try {
      await logout(); // Logout from Privy

      // Reset all states
      setWallet(undefined!); // Remove wallet
      setPrivateKey(""); // Clear private key
      setSelectedToken(TOKEN[0].address); // Reset token selection
      // Navigate back to login page
      wallets.map((w) => {
        w.unlink();
        w.disconnect();
        console.log("disconnection : ", w.address);
      });
      navigate("/home");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //wallet function
  useEffect(() => {
    if (authenticated && ready && walletReady) {
      const timer = setTimeout(() => {
        connectCurrentWallet().then(() => {});
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authenticated, ready, walletReady]);

  const connectCurrentWallet = async () => {
    try {
      if (!ready || !authenticated) {
        console.error("Privy is not ready or user is not authenticated.");
        return;
      }
      if (!user?.wallet) {
        console.error("User wallet data is not available yet.");
        return;
      }

      // Normalize addresses to lower case for reliable comparison
      const currentWalletAddress = user.wallet.address.toLowerCase();
      console.log("User wallet address:", currentWalletAddress);
      console.log("Available wallets:", wallets);

      // Find the wallet in the wallets array that matches the user's wallet address
      const selectedWallet = wallets.find(
        (w) => w.address.toLowerCase() === currentWalletAddress
      );

      if (!selectedWallet) {
        console.error("No matching wallet found for the current user!");
        return;
      }
      setWallet(selectedWallet);
      console.log("Connected to wallet:", selectedWallet);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  const importNewWallet = async () => {
    try {
      if (privateKey) {
        await importWallet({ privateKey: privateKey });
        const importedWallet = wallets.find((wallet) => wallet.imported);
        importedWallet ? setWallet(importedWallet) : {};
      }
      console.log("Wallet imported successfully:", wallet);
    } catch (error) {
      console.error("Failed to import wallet:", error);
    }
  };

  //transaction function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const recipient = data.get("recipient") as string;
    const amount = data.get("amount") as string;

    try {
      if (!wallet) {
        console.error("Wallet not connected!");
        return;
      }

      // Use wallet signer instead of Infura
      const provider = new ethers.BrowserProvider(
        await wallet.getEthereumProvider()
      );
      const signer = await provider.getSigner();

      if (selectedToken === "ETH") {
        console.log("Go to send eth");
        await sendETHTransaction(recipient, amount, signer);
      } else {
        console.log(selectedToken);
        await sendERC20Transaction(selectedToken, recipient, amount, signer);
      }
    } catch (error) {
      console.error("Transaction Failed:", error);
    }
  };

  const sendERC20Transaction = async (
    tokenAddress: string,
    recipient: string,
    amount: string,
    signer: ethers.Signer
  ) => {
    console.log("address :", tokenAddress);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    console.log("contract: ", contract);
    console.log("rec: ", recipient);

    const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 6));
    console.log("ERC-20 Transaction Sent! Hash:", tx.hash);
    await tx.wait();
    console.log("ERC-20 Transaction Confirmed!");
  };

  const sendETHTransaction = async (
    recipient: string,
    amount: string,
    signer: ethers.Signer
  ) => {
    try {
      const provider = signer.provider;
      if (!provider) throw new Error("No provider available!");

      // Fetch sender's balance
      const senderAddress = await signer.getAddress();
      const balance = await provider.getBalance(senderAddress);
      console.log("Sender balance:", ethers.formatEther(balance), "ETH");

      // Convert amount to BigInt for calculations
      const value = ethers.parseUnits(amount, 18);

      // Fetch gas price dynamically
      const feeData = await provider.getFeeData();
      const maxFeePerGas =
        feeData.maxFeePerGas || ethers.parseUnits("3", "gwei");

      // Create transaction request
      const txParams: TransactionRequest = {
        to: recipient,
        value: value,
        chainId: CHAIN_ID,
      };

      // Estimate gas limit
      const estimatedGas = await provider.estimateGas(txParams);
      console.log("Estimated Gas:", estimatedGas.toString());

      // Calculate total cost: value + (gasLimit * maxFeePerGas)
      const totalCost = value + estimatedGas * maxFeePerGas;
      console.log(
        "Total Transaction Cost:",
        ethers.formatEther(totalCost),
        "ETH"
      );

      // Ensure balance is sufficient
      if (balance < totalCost) {
        throw new Error(
          `Insufficient funds! Available: ${ethers.formatEther(
            balance
          )} ETH, Needed: ${ethers.formatEther(totalCost)} ETH`
        );
      }

      // Send transaction
      const tx = await signer.sendTransaction({
        ...txParams,
        gasLimit: estimatedGas,
      });

      console.log("ETH Transaction Sent! Hash:", tx.hash);
      await tx.wait();
      console.log("ETH Transaction Confirmed!");

      return tx.hash;
    } catch (error) {
      console.error("Transaction Failed:", error);
    }
  };

  return {
    userData: {
      user,
      authenticated,
      ready,
    },
    walletData: {
      wallet,
      infuraProvider,
      privateKey,
      walletReady,
    },
    transactionData: {
      txSentInfura,
      selectedToken,
    },
    userFunction: {
      walletLogout,
      get,
    },
    walletFunction: {
      exportWallet,
      setPrivateKey,
      connectCurrentWallet,
      importNewWallet,
    },
    transactionFunction: {
      handleSubmit,
      setSelectedToken,
    },
  };
}
