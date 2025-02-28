import {
  Button,
  Menu as MuiMenu,
  MenuItem,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";
import { CommonProps } from "@mui/material/OverridableComponent";
import { useContext, useState } from "react";
import IosShareIcon from "@mui/icons-material/IosShare";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { ConnectedWallet } from "@privy-io/react-auth";

const styleButton: CommonProps = {
  style: {
    color: "#FFFFF5DB",
    textTransform: "capitalize",
    outline: "none",
  },
};

const Menu = () => {
  const {
    userData: { authenticated, ready },
    walletData: { wallets, wallet, statusCreateWallet },
    userFunction: { get, walletLogout },
    walletFunction: { setWallet, createAdditionalWallet, exportWallet },
  } = useContext(UserContext);

  // Local state to control the dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWalletSelect = (selectedWallet: ConnectedWallet) => {
    // Set the wallet state in the context
    setWallet(selectedWallet);
    handleClose();
  };

  const handleExport = (
    walletToExport: ConnectedWallet,
    e: React.MouseEvent
  ) => {
    // Prevent the parent MenuItem onClick from firing
    e.stopPropagation();
    // Call the exportWallet function (adjust parameters as needed)
    exportWallet({ address: walletToExport.address });
  };

  const handleCopy = (walletToCopy: ConnectedWallet, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(walletToCopy.address);
  };

  return authenticated && ready ? (
    <>
      <Link to={"/home"}>
        <Button {...styleButton}>Home</Button>
      </Link>
      <Link to={"/wallet"}>
        <Button {...styleButton}>Wallet</Button>
      </Link>
      <Link to={"/history"}>
        <Button {...styleButton}>History</Button>
      </Link>
      <Button {...styleButton} onClick={(e) => handleClick(e)}>
        {wallet?.address.substring(0, 10)}...
      </Button>
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {wallets.map(
          (w) =>
            w.walletClientType === "privy" && (
              <MenuItem
                key={w.address}
                onClick={() => handleWalletSelect(w)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText primary={w.address.substring(0, 20) + "..."} />
                <Box>
                  <IconButton onClick={(e) => handleExport(w, e)} size="small">
                    <IosShareIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={(e) => handleCopy(w, e)} size="small">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            )
        )}
        {statusCreateWallet === "success" ? (
          <MenuItem onClick={createAdditionalWallet}>
            <ListItemText
              style={{
                color: "#ececec",
                padding: "5px",
                fontWeight: "bolder",
                backgroundColor: "#646cff",
                textAlign: "center",
                borderRadius: "5px",
              }}
              primary="Create Wallet"
            />
          </MenuItem>
        ) : (
          <MenuItem disabled>
            <ListItemText
              style={{
                color: "#ececec",
                padding: "5px",
                fontWeight: "bolder",
                backgroundColor: "#646cff",
                textAlign: "center",
                borderRadius: "5px",
              }}
              primary="PROCESSING ...."
            />
          </MenuItem>
        )}
      </MuiMenu>
      <Button {...styleButton} onClick={walletLogout}>
        Disconnect
      </Button>
    </>
  ) : (
    <>
      <Link to={"/home"}>
        <Button {...styleButton}>Home</Button>
      </Link>
      <Button {...styleButton} onClick={get}>
        Sign in
      </Button>
    </>
  );
};

export default Menu;
