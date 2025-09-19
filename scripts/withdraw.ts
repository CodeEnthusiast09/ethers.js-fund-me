import { ethers } from "ethers";
import * as fs from "fs-extra";
import { config as dotenvConfig } from "dotenv";
import { Contracts_fundMe_sol_FundMe__factory } from "../typechain-types";

dotenvConfig({ path: ".env", quiet: true });

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) throw new Error("private key not found");

    const wallet = new ethers.Wallet(privateKey, provider);

    const address = fs.readFileSync("deployedAddress.txt", "utf-8").trim();

    const contract = Contracts_fundMe_sol_FundMe__factory.connect(
        address,
        wallet,
    );

    console.log(`🏦 Withdrawing funds from ${address}...`);

    const tx = await contract.withdraw();

    await tx.wait();

    console.log("✅ Withdraw successful");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
