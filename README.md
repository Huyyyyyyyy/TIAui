TIA Project 

A React + TypeScript + Vite frontend with Privy wallet integration and a Rust API backend for transaction processing and history retrieval.

Overview
This project demonstrates a modern Web3 application that integrates the Privy wallet for user authentication and transaction signing. When a transaction is completed on the frontend, it is sent to a Rust API that:

Processes the transaction (Transfer,Swap) and submits it to a Celestia light node.
Stores transaction details in a database (PostgresSQL).
Retrieves transaction history by querying the database (using wallet address, block height, and namespace) and then querying the light node.

The project is built using:

React + TypeScript + Vite for the frontend.
Material-UI (MUI) for styling and UI components.
Privy for wallet authentication and management.
A Rust API for backend processing, light node communication, and database interactions.

Setup and Installation
Prerequisites
Node.js (v16 or higher) and npm or yarn
Rust (with Cargo) installed on your system for the backend
An Infura API key (or similar) configured for your network (e.g. Sepolia)
A Privy account with appropriate credentials configured

Frontend Setup


1. Clone the repository :

```sh
  git clone https://github.com/Huyyyyyyyy/TIAui.git
  cd TIAui
  code .
```

2. Install dependencies :

```sh
npm install
# or if you use yarn:
yarn
```

3. Configure Privy appID :  
Put your AppID into main
```js
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <PrivyProvider
        appId="Your app id here "
        config={{
          appearance: { theme: "dark" },
          loginMethods: ["email"],
          embeddedWallets: { ethereum: { createOnLogin: "off" } },
          defaultChain: sepolia,
          fundingMethodConfig: {
            moonpay: {
              paymentMethod: "credit_debit_card",
              uiConfig: { accentColor: "#696FFD", theme: "dark" },
            },
          },
        }}
      >
        <AppRouter />
      </PrivyProvider>
    </ReactQueryProvider>
  </StrictMode>
);
```

4. Start the frontend :

```sh
npm run dev
# or
yarn dev
```

Project Structure

Below is a brief overview of the project structure:
```js
src
│   index.css
│   main.tsx
│   vite-env.d.ts
│
├───apis
│       user.ts                    // Here is the definition of API call to our Rust API
│
├───components
│   ├───Footer
│   │       Footer.tsx
│   │
│   ├───Header
│   │       Header.tsx
│   │       Logo.tsx
│   │       Menu.tsx                // Wallet control UI
│   │
│   ├───History
│   │       HisotryComponent.tsx    // Transaction History UI 
│   │
│   ├───Home
│   │       Banner.tsx
│   │
│   └───Wallet
│           ImportForm.tsx          // Wallet import & transaction UI
│
├───const
│       const.ts                    // Constants such as TOKEN, NETWORK, CHAIN_ID, etc.
│       erc20.json                  // Here is the Contract ABI (Application Binary Interface) of the ERC20 Token
│       router02.json               // Here is the Contract ABI (Application Binary Interface) of the Uniswap Contract (for token swapping purposes)
│
├───context
│       UserContext.ts              //Here is the context of user
│
├───hooks
│       useUser.ts                  //Here is all of function and variables state being defined 
│
├───layout
│       Layout.tsx                  //Here is the context of user being initialized
│
├───pages
│       HistoryPage.tsx             //The container of the History component
│       HomePage.tsx                //The container of the Home component
│       WalletPage.tsx              //The container of the Wallet component
│
├───providers
│       ReactQueryProvider.tsx
│
├───routes
│       AppRouter.tsx                //This folder wil take responsibility for routing betweeen pages 
│       HistoryRoute.tsx
│       HomeRouter.tsx
│       WalletRouter.tsx
│
└───types
        user.ts                      //Here is all the type of user, wallet and payload (for API calling) defined
```
