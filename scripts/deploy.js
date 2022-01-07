
const delay = ms => new Promise(res => setTimeout(res, ms));

const main = async () => {
    
    const [deployer] = await ethers.getSigners();

    const testFactory = await hre.ethers.getContractFactory("SoladayAccessControl");
    const testContract = await testFactory.deploy();
    await testContract.deployed();

    console.log("Deployed:", testContract.address);
    console.log("Deployer:", deployer.address);

    console.log("Waiting for bytecode to propogate (60sec)");
    await delay(60000);

    console.log("Verifying on Etherscan");

    await hre.run("verify:verify", {
        address: testContract.address,
      });

    console.log("Verified on Etherscan");

    // let txn = await testContract.mint(deployer.address)
    // await txn.wait();
    // console.log("SoladayRNG deployed and an NFT minted.");

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();