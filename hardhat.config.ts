import { HardhatUserConfig } from 'hardhat/config'
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });


import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan";


const config: HardhatUserConfig = {
  solidity: "0.8.11",
  etherscan: {
    apiKey: process.env.SOLADAY_ETHERSCAN_API_KEY || "",
  },
  networks: {
    rinkeby: {
      url: process.env.INFURA_RINKEBY_KEY || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    kovan: {
      url: process.env.INFURA_KOVAN_KEY || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    "optimistic-kovan": {
      url: 'https://kovan.optimism.io' || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};

export default config