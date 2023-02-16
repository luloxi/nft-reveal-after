const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  // const chainId = network.config.chainId

  log("----------------------------")
  // const mintFee = networkConfig[chainId]["mintFee"]

  const args = []

  const basicNft = await deploy("ELC", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(basicNft.address, args)
  }

  log("----------------------------")
}

module.exports.tags = ["all", "ELC"]
