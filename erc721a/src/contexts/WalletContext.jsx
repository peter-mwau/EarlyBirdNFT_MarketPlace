import { createContext } from 'react';

const WalletContext = createContext({
    account: null,
    balance: null,
    isWalletConnected: false,
    tokenBalance: null,
    peopleData: [],
    connectWallet: () => {},
    disconnectWallet: () => {},
});

export default WalletContext;