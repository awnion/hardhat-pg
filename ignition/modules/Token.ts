import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const TokenModule = buildModule("PlatformModule", (m) => {

	const token = m.contract("Token", []);

	return { token };
});

export default TokenModule;
