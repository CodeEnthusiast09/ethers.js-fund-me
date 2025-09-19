import { ethers } from "ethers";
import * as fs from "fs-extra";
import { config as dotenvConfig } from "dotenv";
import { Contracts_fundMe_sol_FundMe } from "../typechain-types";

dotenvConfig({ path: ".env", quiet: true });

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error("private key not found");

    const wallet = new ethers.Wallet(privateKey, provider);

    const abi = JSON.parse(
        fs.readFileSync("./build/contracts_fund-me_sol_FundMe.abi", "utf-8"),
    );
    const binary = fs.readFileSync(
        "./build/contracts_fund-me_sol_FundMe.bin",
        "utf-8",
    );

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    console.log("Deploying FundMe contract...");

    const contract =
        (await contractFactory.deploy()) as Contracts_fundMe_sol_FundMe;

    await contract.waitForDeployment();
    const address = await contract.target;

    console.log(`FundMe deployed to: ${address}`);
    console.log(`Deployer: ${wallet.address}`);
    console.log(`Network: ${(await provider.getNetwork()).name}`);

    // Save deployed address to a file for later scripts
    fs.writeFileSync("deployedAddress.txt", address.toString());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
