import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlatformModule = buildModule("PlatformModule", (m) => {
	const platform = m.contract("Platform", []);

	// const allowance = m.call(platform, "giveAllowance", []);
	// const charge = m.call(platform, "charge", [allowance.from!, allowance.from!, 1]);

	return { platform };
});

export default PlatformModule;
