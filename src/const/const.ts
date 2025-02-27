import contract from "../const/erc20.json";
export const BASE_URL =
  "https://r6q46ueigvd4aisz6msv7tuwjy0kadlm.lambda-url.ap-southeast-1.on.aws";
export const NETWORK = "sepolia";
export const INFURA_API_KEY = "2557fd04c3ef4e1289853ebaf5cb35ad";
export const CHAIN_ID = 11155111;
export const ERC20_ABI = contract;

export const TOKEN = [
  {
    name: "ETH",
    address: "ETH", // Special case for ETH
    icon: "https://www.okx.com/cdn/oksupport/asset/currency/icon/eth.png",
  },
  {
    name: "USDC",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    icon: "https://www.okx.com/cdn/oksupport/asset/currency/icon/usdc.png",
  },
  {
    name: "LINK",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    icon: "https://www.okx.com/cdn/oksupport/asset/currency/icon/link.png",
  },
  {
    name: "WETH",
    address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    icon: "https://www.okx.com/cdn/wallet/logo/WETH-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  },
];

export const ROUTER02 = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3";
import router02Contract from "../const/router02.json";
export const ROUTER02_ABI = router02Contract;


//function 
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
