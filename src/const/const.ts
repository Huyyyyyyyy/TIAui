import contract from "../const/erc20.json";
export const BASE_URL = "http://localhost:3300";
export const NETWORK = "sepolia";
export const INFURA_API_KEY = "2557fd04c3ef4e1289853ebaf5cb35ad";
export const CHAIN_ID = 11155111;
export const ERC20_ABI = contract;
export const TOKEN = [
  { name: "Ethereum (ETH)", address: "ETH" }, // Special case for ETH
  { name: "USDC", address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" },
  { name: "LINK", address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" },
  { name: "WETH", address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14" },
];
