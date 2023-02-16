const { deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { assert, expect } = require("chai")

// const chainId = network.config.chainId

// If not on a development chain
!developmentChains.includes(network.name)
  ? describe.skip // skip this test, otherwise...
  : describe("ELC Unit Tests", async function () {
      let deployer, ELC, buyer, mintFee

      beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        buyer = accounts[1]
        await deployments.fixture("ELC")
        ELC = await ethers.getContract("ELC")
        ELCbuyer = await ethers.getContract("ELC", buyer)

        mintFee = await ELC.i_mintFee()
      })
      describe("Basic Variables check", function () {
        it("initializes the contract correctly", async function () {
          const name = await ELC.name()
          const symbol = await ELC.symbol()
          const tokenCounter = await ELC.getTokenCounter()
          assert.equal(name, "Eco Lions Club")
          assert.equal(symbol, "ELC")
          assert.equal(tokenCounter.toString(), "0")
        })
      })
      describe("Mint NFT", () => {
        beforeEach(async () => {
          const transactionResponse = await ELC.mint({ value: mintFee })
          await transactionResponse.wait(1)
        })
        it("Updates tokenCounter and shows hidden JSON after mint", async function () {
          const tokenCounter = await ELC.getTokenCounter()
          const tokenURI = await ELC.tokenURI(1)
          const baseURI = await ELC.baseURI()
          assert.equal(tokenCounter.toString(), "1")
          assert.equal(tokenURI.toString(), `${baseURI}hidden.json`)
        })
        it("Shows the correct balance for an owner of an NFT", async function () {
          const deployerAddress = deployer.address
          const deployerBalance = await ELC.balanceOf(deployerAddress)
          assert.equal(deployerBalance.toString(), "1")
        })
        it("Shows updated metadata after changing Base URI", async function () {
          const newIPFS = "ipfs://NEWIPFS/"
          const transactionResponse = await ELC.changeBaseURI(newIPFS)
          await transactionResponse.wait(1)
          const tokenURI = await ELC.tokenURI(1)
          assert.equal(tokenURI.toString(), `${newIPFS}1.json`)
        })
        it("Reverts if not enough ETH is sent", async function () {
          expect(ELC.mint({ value: mintFee - 1 })).to.be.revertedWith("ELC__NeedMoreETHSent()")
        })
        it("Reverts if trying to mint more than 50", async function () {
          // Minting 49, remember one mint happens on the beforeEach condition
          for (let i = 0; i < 49; i++) {
            await ELC.mint({ value: mintFee })
          }
          expect(ELC.mint({ value: mintFee })).to.be.revertedWith("ELC__MintingCompleted()")
        })
      })
      describe("Withdraw ETH", () => {
        beforeEach(async () => {
          for (let i = 0; i < 50; i++) {
            await ELCbuyer.mint({ value: mintFee })
          }
        })
        it("Withdraws all ETH to owner address", async function () {
          const minting50cost = mintFee.mul(50)
          // Get starting balance of deployer (owner) address
          const startingDeployerBalance = await ELC.provider.getBalance(deployer.address)
          // Call withdraw from deployer's (owner) address
          const transactionResponse = await ELC.withdraw()
          // Wait for 1 block confirmation
          const transactionReceipt = await transactionResponse.wait(1)
          // Get these variables to precisely compute ETH withdrawn - gas used
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          // Multiply these bigNumbers to get the gasCost
          const gasCost = gasUsed.mul(effectiveGasPrice)
          // Get deployer's (owner) balance after calling withdraw()
          const endingDeployerBalance = await ELC.provider.getBalance(deployer.address)
          assert.equal(
            startingDeployerBalance.add(minting50cost).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        it("Reverts if someone other than owner tries to withdraw", async function () {
          expect(ELCbuyer.withdraw()).to.be.reverted
        })
      })
    })
