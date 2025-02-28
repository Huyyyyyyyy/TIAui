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

Please be awared of we also have Backend Rust API 
Here is this resource :
```js
https://github.com/Huyyyyyyyy/TIASvc.git
```

Frontend Setup

1. Can visit the hosted site for review without any setup (we will keep this host active until 28/3/2024 for you guys to review)
```js
Cloudfront URL : https://d1s1ou499za61r.cloudfront.net
```
2. Clone the repository :

```sh
  git clone https://github.com/Huyyyyyyyy/TIAui.git
  cd TIAui
  code .
```

3. Install dependencies :

```sh
npm install
# or if you use yarn:
yarn
```

4. Configure Privy appID :  
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

5. Start the frontend :

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

### Key Features

- **Privy Wallet Integration:**  
  - Users can sign in with Privy.
  - Manage wallet connections by picking the coresponding wallet of user
    ```js
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
    ```
  - Import wallets using a private key
    ```js
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
    ```
  - Create additional Wallets
    ```js
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
    ```
  
- **Transaction Processing:**  
  When a transaction is complete on the frontend, the details are packaged and sent to the Rust API. The API processes the transaction by
  - Submitting it to a light node.
  - Storing transaction details in a database.
  
- **History Retrieval:**  
  The frontend history page calls the Rust API to fetch the transaction history.
  The API uses the wallet’s address to query the database, retrieves the corresponding block height and namespace,
  and then queries the light node for transaction details.

- **Responsive UI:**  
  Built with Material-UI, the application offers a modern and responsive user interface.

---

## Special Instructions and Requirements

- **Network Configuration:**  
  Ensure that Privy configuration, and blockchain network (e.g., Sepolia) are correctly set up. The environment variables in the frontend should match your backend configurations.

- **Privy Integration:**  
  Follow the [Privy documentation](https://docs.privy.io/) to correctly set up your PrivyProvider and related hooks.
  The application relies on Privy for user authentication, wallet import, and signing transactions.

- **Rust API Setup:**  
  Make sure you successfully run the Rust API (currently our Rust API just enable on AWS Lambda function with the static function url).
  We will keep the function active for you guys to do the review of demo sites for a month then we will disable this function at 28/3/2024.

- **Database: PostgreSQL**  
  Ensure that your database is running and that the Rust API has correct connection details.
  The database stores transaction history, and the history page fetches this data via the API.

- **Partner Technologies:**  
  - **Privy Wallet:** Used for non-custodial wallet management and authentication.
  
---
