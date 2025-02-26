import { useContext } from "react";
import { Button, TextField } from "@mui/material";
import UserContext from "../../context/UserContext";
import { CommonProps } from "@mui/material/OverridableComponent";
import { TOKEN } from "../../const/const";

const styleText: CommonProps = {
  style: {
    color: "#FFFFF5DB",
    outline: "none",
    backgroundColor: "#A8B1FF",
  },
};
const ImportForm = () => {
  const {
    userData: { ready, authenticated },
    walletData: { wallet, privateKey },
    transactionData: { txSentInfura, selectedToken },
    userFunction: {},
    walletFunction: { setPrivateKey, connectCurrentWallet, importNewWallet },
    transactionFunction: { handleSubmit, setSelectedToken },
  } = useContext(UserContext);

  return !wallet?.address ? (
    <>
      <div>
        <input
          type="text"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Enter your private key"
        />
        <button onClick={importNewWallet} disabled={!authenticated || !ready}>
          Import new wallet
        </button>

        <button
          onClick={connectCurrentWallet}
          disabled={!authenticated || !ready}
        >
          Connect current wallet
        </button>
      </div>
    </>
  ) : (
    <>
      <p>{wallet ? wallet.address : ""}</p>
      <h3> Fill the form to send ETH </h3>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Select Asset:</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
          >
            {TOKEN.map((token) => (
              <option key={token.address} value={token.address}>
                {token.name}
              </option>
            ))}
          </select>
          <TextField
            type="text"
            name="recipient"
            placeholder="Recipient Address"
          />
          <TextField type="text" name="amount" placeholder="Amount" />
          <Button {...styleText} type="submit">
            SEND
          </Button>
        </form>
        <p>{txSentInfura}</p>
      </div>
    </>
  );
};

export default ImportForm;
