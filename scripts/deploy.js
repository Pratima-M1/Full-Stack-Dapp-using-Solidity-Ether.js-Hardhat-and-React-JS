// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalances(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}
async function consoleBalances(addresses) {
  let count = 0;
  for (const address of addresses) {
    console.log(`Address ${count} balance is ${await getBalances(address)}`);
    count++;
  }
}

async function consoleMemos(memos) {
  for (const memo of memos) {
    const name = memo.name;
    const message = memo.message;
    const timestamp = memo.timestamp;
    const from = memo.from;
    console.log(
      `At ${timestamp} ,name ${name}, from:${from},message ${message}`
    );
  }
}
async function main() {
  const [owner, signer1, signer2, signer3] = await hre.ethers.getSigners();
  const contractChai = await hre.ethers.getContractFactory("chai");
  const contract = await contractChai.deploy();
  contract.waitForDeployment();
  console.log(`Contract address:${contract.target}`);
  const addresses = [
    owner.address,
    signer1.address,
    signer2.address,
    signer3.address,
  ];
  console.log("before buying chai");
  await consoleBalances(addresses);
  const amount = { value: hre.ethers.parseEther("1") };
  await contract.connect(signer1).buyChai("signer1", "very nice chai", amount);
  await contract
    .connect(signer2)
    .buyChai("signer2", "very nice course", amount);
  await contract.connect(signer3).buyChai("signer3", "very nice info", amount);
  console.log("After buying chai");
  await consoleBalances(addresses);
  const memos = await contract.getMemos();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
