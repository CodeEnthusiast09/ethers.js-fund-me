import { ethers } from "ethers";
import * as fs from "fs-extra";
import { config as dotenvConfig } from "dotenv";
import { Contracts_fundMe_sol_FundMe__factory } from "../typechain-types";

dotenvConfig({ path: ".env", quiet: true });

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const address = fs.readFileSync("deployedAddress.txt", "utf-8").trim();

    const contract = Contracts_fundMe_sol_FundMe__factory.connect(
        address,
        provider,
    );

    const minUsd = await contract.MINIMUM_USD();

    const version = await contract.getVersion();

    const owner = await contract.i_owner();

    console.log("ℹ️ Contract Info:");

    console.log(`   Address: ${address}`);

    console.log(`   Owner: ${owner}`);

    console.log(`   MINIMUM_USD: ${ethers.formatEther(minUsd)} USD`);

    console.log(`   PriceFeed Version: ${version.toString()}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
