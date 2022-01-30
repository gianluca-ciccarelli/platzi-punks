const deploy = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
    const deployed = await PlatziPunks.deploy(10000);

    console.log("PlatziPunks was deployed at:", deployed.address);
}

deploy().then(() => {
    process.exit(0)
}).catch(err => {
    console.error(err)
    process.exit(1)
})