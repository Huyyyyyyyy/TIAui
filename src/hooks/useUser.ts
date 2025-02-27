import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ConnectedWallet,
  useCreateWallet,
  useFundWallet,
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
  ROUTER02,
  ROUTER02_ABI,
  sleep,
  TOKEN,
} from "../const/const";
import { FaucetUsdcPayload, TransactionPayload } from "../types/user";
import {
  getUsdcFaucet,
  sendSwapPayload,
  sendTransferPayload,
} from "../apis/user";
import { sepolia } from "viem/chains";

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
  const [balance, setBalance] = useState("0");
  const [faucetStatus, setFaucetStatus] = useState("success");
  const { fundWallet } = useFundWallet();
  const { createWallet } = useCreateWallet();
  const [statusCreateWallet, setStatusCreateWallet] = useState("success");

  //transaction data
  const [txSentInfura] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState(TOKEN[0].name);
  const [inputToken, setInputToken] = useState(TOKEN[0].name);
  const [outputToken, setOutputToken] = useState(TOKEN[1].name);
  const [amountSwap, setAmountSwap] = useState("");

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
      setSelectedToken(TOKEN[0].name); // Reset token selection
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

  const getBalance = async () => {
    const provider = new ethers.BrowserProvider(
      await wallet.getEthereumProvider()
    );
    const signer = await provider.getSigner();
    const balance = await provider.getBalance(await signer.getAddress());
    setBalance(ethers.formatEther(balance).toString());
  };

  const getERC20Balance = async (name: string): Promise<string> => {
    const provider = new ethers.BrowserProvider(
      await wallet.getEthereumProvider()
    );
    const obj: { name: string; address: string } | undefined =
      getTokenByName(name);
    if (!obj) return "";
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(obj.address, ERC20_ABI, signer);
    let balance = await contract.balanceOf(await signer.getAddress());
    const decimals = await contract.decimals();
    balance = ethers.formatUnits(balance, decimals);
    return (+balance).toFixed(2);
  };

  const faucetUSDC = async () => {
    try {
      setFaucetStatus("loading");
      setFaucetStatus("loading");
      if (!wallet.address) return;
      const payload: FaucetUsdcPayload = {
        amount: "5.00",
        chain: "ETH",
        destination_address: wallet.address,
      };
      await getUsdcFaucet(payload);
      await sleep(2000);
      setFaucetStatus("success");
    } catch (e) {
      console.log(e);
      setFaucetStatus("success");
    }
  };

  const fundUserWallet = async (address: string) => {
    await fundWallet(address, { chain: sepolia, asset: "USDC" });
  };

  const createAdditionalWallet = async () => {
    try {
      setStatusCreateWallet("loading");
      await createWallet({ createAdditional: true });
      setStatusCreateWallet("success");
    } catch (e) {
      console.log(e);
      setStatusCreateWallet("success");
      return;
    }
  };
  //transaction function

  const getTokenByName = (name: string) => {
    return TOKEN.find((token) => token.name === name);
  };

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
      const token = getTokenByName(selectedToken);
      console.log(selectedToken);
      if (token?.name === "ETH") {
        await sendETHTransaction(recipient, amount, signer);
      } else {
        if (token) await sendERC20Transaction(token, recipient, amount, signer);
      }
    } catch (error) {
      console.error("Transaction Failed:", error);
    }
  };

  const sendERC20Transaction = async (
    token: { name: string; address: string },
    recipient: string,
    amount: string,
    signer: ethers.Signer
  ) => {
    const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
    const decimals = await contract.decimals();

    const tx = await contract.transfer(
      recipient,
      ethers.parseUnits(amount, decimals)
    );
    await tx.wait();
    const payload: TransactionPayload = {
      tx_type: "CryptoTransfer",
      data: {
        transaction_hash: tx.hash,
        sender_address: await signer.getAddress(),
        recipient_address: recipient,
        amount: amount,
        chain: token.name,
        timestamp: Date.now().toString(),
      },
    };

    await sendTransferPayload(payload);
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

      // Convert amount to BigInt for calculations
      const value = ethers.parseUnits(amount, 18);

      // Create transaction request
      const txParams: TransactionRequest = {
        to: recipient,
        value: value,
        chainId: CHAIN_ID,
      };

      // Estimate gas limit
      const estimatedGas = await provider.estimateGas(txParams);

      // Send transaction
      const tx = await signer.sendTransaction({
        ...txParams,
        gasLimit: estimatedGas,
      });

      await tx.wait();
      console.log("ETH Transaction Sent! Hash:", tx.hash);

      const payload: TransactionPayload = {
        tx_type: "CryptoTransfer",
        data: {
          transaction_hash: tx.hash,
          sender_address: senderAddress,
          recipient_address: recipient,
          amount: amount,
          chain: selectedToken,
          timestamp: Date.now().toString(),
        },
      };

      await sendTransferPayload(payload);
      return tx.hash;
    } catch (error) {
      console.error("Transaction Failed:", error);
    }
  };

  const swapToken = async (
    inputToken: string,
    outputToken: string,
    amountIn: string,
    signer: ethers.Signer
  ) => {
    const router = new ethers.Contract(ROUTER02, ROUTER02_ABI, signer);
    const spenderAddress = await signer.getAddress();
    //map token
    const from = inputToken == "ETH" ? "WETH" : inputToken;
    const inputTokenObj = getTokenByName(from);
    if (!inputTokenObj) return;
    const inputContract = new ethers.Contract(
      inputTokenObj?.address,
      ERC20_ABI,
      signer
    );

    const to = outputToken == "ETH" ? "WETH" : outputToken;
    const outputTokenObj = getTokenByName(to);
    if (!outputTokenObj) return;

    const decimals = await inputContract.decimals();
    const approvalAmount = ethers.parseUnits(amountIn, decimals);

    console.log(from, to);
    let amountsOut = await router.getAmountsOut(approvalAmount, [
      inputTokenObj.address,
      outputTokenObj.address,
    ]);
    console.log(amountsOut);

    const amountOutMin = (amountsOut[1] * 95n) / 100n;

    const approveTx = await inputContract.approve(ROUTER02, approvalAmount);
    await approveTx.wait();

    let tx;
    // Define a deadline (e.g., current time + 20 minutes)
    const deadline = Math.floor(Date.now() / 1000) + 20 * 60;
    if (inputToken === "ETH") {
      // Swap ETH for tokens
      console.log("go in ETH");
      tx = await router.swapExactETHForTokens(
        amountOutMin,
        [inputTokenObj.address, outputTokenObj.address],
        spenderAddress,
        deadline,
        { value: approvalAmount }
      );
    } else if (outputToken === "ETH") {
      // Swap tokens for ETH
      console.log("go out ETH");
      tx = await router.swapExactTokensForETH(
        approvalAmount,
        amountOutMin,
        [inputTokenObj.address, outputTokenObj.address],
        spenderAddress,
        deadline
      );
    } else {
      // Token for token swap
      console.log("go in/out token");
      tx = await router.swapExactTokensForTokens(
        approvalAmount,
        amountOutMin,
        [inputTokenObj.address, outputTokenObj.address],
        spenderAddress,
        deadline
      );
    }

    await tx.wait();
    console.log("Swap Transaction Sent! Hash:", tx.hash);

    const payload: TransactionPayload = {
      tx_type: "Swap",
      data: {
        transaction_hash: tx.hash,
        address: spenderAddress,
        amount_in: amountIn,
        from_token: inputToken,
        to_token: outputToken,
        timestamp: Date.now().toString(),
      },
    };

    await sendSwapPayload(payload);
    return tx.hash;
  };

  const handleSwapSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputToken === outputToken) {
      alert("Input and output tokens must be different.");
      return;
    }
    const provider = new ethers.BrowserProvider(
      await wallet.getEthereumProvider()
    );
    const signer = await provider.getSigner();
    swapToken(inputToken, outputToken, amountSwap.toString(), signer);
  };

  return {
    userData: {
      user,
      authenticated,
      ready,
    },
    walletData: {
      wallet,
      wallets,
      infuraProvider,
      privateKey,
      walletReady,
      balance,
      faucetStatus,
      statusCreateWallet,
    },
    transactionData: {
      txSentInfura,
      selectedToken,
      inputToken,
      outputToken,
      amountSwap,
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
      getBalance,
      getERC20Balance,
      faucetUSDC,
      fundUserWallet,
      setWallet,
      createAdditionalWallet,
    },
    transactionFunction: {
      handleSubmit,
      handleSwapSubmit,
      setSelectedToken,
      setOutputToken,
      setInputToken,
      setAmountSwap,
    },
  };
}
