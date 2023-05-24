require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.18",
  networks: {
    metic: {
      url: process.env.URL,
      accounts: [process.env.PK],
    },
  },
};
