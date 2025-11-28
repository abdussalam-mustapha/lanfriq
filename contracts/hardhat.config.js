require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const CAMP_API_KEY = process.env.CAMP_API_KEY || "4f1a2c9c-008e-4a2e-8712-055fa04f9ffa";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    campTestnet: {
      url: "https://rpc.basecamp.t.raas.gelato.cloud",
      chainId: 123420001114,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
    campMainnet: {
      url: "https://rpc-campnetwork.xyz",
      chainId: 484,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      campTestnet: CAMP_API_KEY,
      campMainnet: CAMP_API_KEY,
    },
    customChains: [
      {
        network: "campTestnet",
        chainId: 123420001114,
        urls: {
          apiURL: "https://basecamp.cloud.blockscout.com/api",
          browserURL: "https://basecamp.cloud.blockscout.com",
        },
      },
      {
        network: "campMainnet",
        chainId: 484,
        urls: {
          apiURL: "https://explorer.campnetwork.xyz/api",
          browserURL: "https://explorer.campnetwork.xyz",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
