require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  settings: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  },
  etherscan: {
    apiKey: process.env.SOLADAY_ETHERSCAN_API_KEY,
  },
  networks: {
    rinkeby: {
      url: process.env.INFURA_RINKEBY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    "optimistic-kovan": {
      url: 'https://kovan.optimism.io',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
