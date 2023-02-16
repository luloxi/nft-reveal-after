const networkConfig = {
  31337: {
    name: "localhost",
    mintFee: "76000000000000000", // 0.076 ETH
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  5: {
    name: "goerli",
    mintFee: "76000000000000000", // 0.076 ETH
  },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  developmentChains,
}
