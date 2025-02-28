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

3. Start the frontend :

```sh
npm run dev
# or
yarn dev
```
