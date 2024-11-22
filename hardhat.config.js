require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    opBNB: {
      url: process.env.OPBNB_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 204,
      gasPrice: 5000000000, // 5 gwei
      gas: 2000000 // 2M gas limit
    },
    opBNBTestnet: {
      url: process.env.OPBNB_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5611,
      gasPrice: 5000000000, // 5 gwei
      gas: 2000000 // 2M gas limit
    }
  },
  etherscan: {
    apiKey: {
      opBNB: process.env.BSCSCAN_API_KEY,
      opBNBTestnet: process.env.BSCSCAN_API_KEY
    },
    customChains: [
      {
        network: "opBNB",
        chainId: 204,
        urls: {
          apiURL: "https://api-opbnb.bscscan.com/api",
          browserURL: "https://opbnb.bscscan.com"
        }
      },
      {
        network: "opBNBTestnet",
        chainId: 5611,
        urls: {
          apiURL: "https://api-testnet-opbnb.bscscan.com/api",
          browserURL: "https://testnet-opbnb.bscscan.com"
        }
      }
    ]
  }
};
