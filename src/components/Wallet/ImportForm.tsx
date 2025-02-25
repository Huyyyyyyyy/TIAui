import React, { useContext, useState } from "react";
import { Form, Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import UserContext from "../../context/UserContext";
import { CommonProps } from "@mui/material/OverridableComponent";
import { ethers, TransactionRequest, Wallet } from "ethers";

const styleText: CommonProps = {
  style: {
    color: "#FFFFF5DB",
    outline: "none",
  },
};
const ImportForm = () => {
  const {
    data: { status, authenticated, ready, userImport, user, wallet },
    functions: { get, handleImportWallet, exportWallet, getWallet },
  } = useContext(UserContext);

  const infuraProvider = new ethers.InfuraProvider(
    "sepolia",
    "2557fd04c3ef4e1289853ebaf5cb35ad"
  );
  const [blockNumber, setBlockNumber] = useState<Number>(0);
  const [txSent, setTxSent] = useState(null);
  const [txSentInfura, setTxSentInfura] = useState<string>("");

  const handleButton1 = async () => {
    const latest_block = await infuraProvider.getBlockNumber();
    setBlockNumber(latest_block);
  };

  const handleSubmitInfura = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const address = data.get("address") || "";
    const amount = data.get("amount") || 0;
    const signer: Wallet = new ethers.Wallet(
      "ae570f73ea1c079c89662cf0533b1d6ba5a826ba51c117eb86d07193bfb3418f",
      infuraProvider
    );
    sendTransaction(address.toString(), +amount, signer);
  };

  const sendTransaction = async (
    address: string,
    amount: number,
    signer: Wallet
  ) => {
    const t: TransactionRequest = {
      from: "0x1771D36bAdB0F13cf56718CE2c41B5E4dB87E8cf",
      to: address,
      value: ethers.parseEther(amount.toString()),
      maxFeePerGas: ethers.parseUnits("2", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"),
    };
    const tx = await signer.signTransaction(t);
    console.log("tx", tx);
    setTxSentInfura("Transaction initiated! Tx hash: " + tx);

    // const rs = await signer.populateTransaction(t);
  };

  return !user?.wallet?.address ? (
    <>
      <h1>Sign in</h1>
      <Form onSubmit={get}>
        <TextField
          id="outlined-basic password-input"
          label="Password"
          variant="outlined"
          name="privateKey"
          value={userImport?.privateKey}
          type="password"
          onChange={handleImportWallet}
        />
        <Button
          type="submit"
          disabled={
            userImport?.privateKey === "" || status === "loading" ? true : false
          }
        >
          {status === "loading" ? "Loading..." : "Sign in"}
        </Button>
      </Form>
    </>
  ) : (
    <>
      <p>{wallet ? wallet.address : ""}</p>
      <Button
        {...styleText}
        disabled={wallet ? true : false}
        onClick={async () => {
          user.wallet?.address ? getWallet(user.wallet?.address) : {};
        }}
      >
        Get Your Wallet
      </Button>

      <h3> Press one of the buttons to find out the latest block number: </h3>
      <div>
        <button onClick={handleButton1}>InfuraProvider</button>
        <p>{blockNumber.toString()}</p>
      </div>
      <h3> Fill out the form to send a transaction via InfuraProvider: </h3>
      <div>
        <form onSubmit={handleSubmitInfura}>
          <input type="text" name="address" placeholder="Recipient Address" />
          <input type="text" name="amount" placeholder="Amount (ETH)" />
          <input type="submit" value="Send w/ InfuraProvider" />
        </form>
        <p>{txSentInfura}</p>
      </div>
    </>
  );
};

export default ImportForm;
