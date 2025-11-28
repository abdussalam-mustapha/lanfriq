const hre = require("hardhat");

async function main() {
  console.log("Deploying Lanfriq contracts to Camp Network...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy PropertyNFT
  console.log("\n1. Deploying PropertyNFT...");
  const PropertyNFT = await hre.ethers.getContractFactory("PropertyNFT");
  const propertyNFT = await PropertyNFT.deploy();
  await propertyNFT.waitForDeployment();
  const propertyNFTAddress = await propertyNFT.getAddress();
  console.log("PropertyNFT deployed to:", propertyNFTAddress);

  // Deploy PropertyMarketplace
  console.log("\n2. Deploying PropertyMarketplace...");
  const PropertyMarketplace = await hre.ethers.getContractFactory("PropertyMarketplace");
  const marketplace = await PropertyMarketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("PropertyMarketplace deployed to:", marketplaceAddress);
  
  // Set PropertyNFT address in marketplace
  console.log("\n3. Configuring PropertyMarketplace...");
  await marketplace.setPropertyNFT(propertyNFTAddress);
  console.log("PropertyMarketplace configured with PropertyNFT address");

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      PropertyNFT: {
        address: propertyNFTAddress,
      },
      PropertyMarketplace: {
        address: marketplaceAddress,
      },
    },
  };

  const deploymentPath = `./deployments/${hre.network.name}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentPath);

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    // Verify contracts on block explorer
    console.log("\nVerifying contracts on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: propertyNFTAddress,
        constructorArguments: [],
      });
      console.log("PropertyNFT verified");
    } catch (error) {
      console.log("PropertyNFT verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: marketplaceAddress,
        constructorArguments: [],
      });
      console.log("PropertyMarketplace verified");
    } catch (error) {
      console.log("PropertyMarketplace verification failed:", error.message);
    }
  }

  console.log("\n✅ Deployment completed successfully!");
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("PropertyNFT:", propertyNFTAddress);
  console.log("PropertyMarketplace:", marketplaceAddress);
  console.log("\nAdd these addresses to your frontend .env file:");
  console.log(`VITE_PROPERTY_NFT_ADDRESS=${propertyNFTAddress}`);
  console.log(`VITE_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
