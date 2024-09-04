import {
	time,
	loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, gweiUnits, parseGwei } from "viem";

describe("Platform", () => {
	async function platformFixture() {
		const [platformWallet, clientWallet, merchantWallet] =
			await hre.viem.getWalletClients();

		const tokenContract = await hre.viem.deployContract("Token");
		const platformContract = await hre.viem.deployContract("Platform", [
			tokenContract.address,
		]);

		const publicClient = await hre.viem.getPublicClient();

		return {
			tokenContract,
			platformContract,
			publicClient,
			platformWallet,
			clientWallet,
			merchantWallet,
		};
	}

	describe("Simple tests", () => {
		it("Allow send money", async () => {
			const {
				tokenContract,
				platformContract,
				publicClient,
				clientWallet,
				merchantWallet,
				platformWallet,
			} = await loadFixture(platformFixture);

			const merchantClient = await hre.viem.getContractAt(
				"Platform",
				platformContract.address,
				{ client: { wallet: merchantWallet } },
			);

			const clientClient = await hre.viem.getContractAt(
				"Platform",
				platformContract.address,
				{ client: { wallet: clientWallet } },
			);

			const plaformClient = await hre.viem.getContractAt(
				"Platform",
				platformContract.address,
				{ client: { wallet: platformWallet } },
			);

			//stripe
			// ~ 1.5 - 3% + not all transactions can pass

			//! MVP
			// merchant wallets
			// - main ETH but super cost $3-$10
			// - arbitrum  ~$0.00_01
			// - optimism  ~$0.00_01
			// - base
			// - zksync
			// - sei
			// - and so on

			//! optional
			// non ETH nets: -solana (rust) -near -xrp -bitcoin???/lighting

			const hash = await clientClient.write.giveAllowance(); // web without back on client browser
			console.log("Give Allowance Hash:", hash);
			console.log("Clent address", clientWallet.account.address);
			console.log("Merchant address", merchantWallet.account.address);
			console.log("Platform address", platformWallet.account.address);
			const transactionReceipt = await publicClient.waitForTransactionReceipt({
				hash,
			});
			console.log("receipt", transactionReceipt);
			expect(transactionReceipt).to.haveOwnProperty("status");

			console.log(
				"allowance",
				await tokenContract.read.allowance([
					clientWallet.account.address,
					plaformClient.address,
				]),
			);

			expect(
				await plaformClient.write.charge([
					// web2 ------ full controll of the platform
					clientWallet.account.address,
					merchantWallet.account.address,
					BigInt(1),
				]),
			);
		});

		// 	it("Should set the right owner", async function () {
		// 		const { lock, owner } = await loadFixture(platformFixture);

		// 		expect(await lock.read.owner()).to.equal(
		// 			getAddress(owner.account.address),
		// 		);
		// 	});

		// 	it("Should receive and store the funds to lock", async function () {
		// 		const { lock, lockedAmount, publicClient } = await loadFixture(
		// 			platformFixture,
		// 		);

		// 		expect(
		// 			await publicClient.getBalance({
		// 				address: lock.address,
		// 			}),
		// 		).to.equal(lockedAmount);
		// 	});

		// 	it("Should fail if the unlockTime is not in the future", async function () {
		// 		// We don't use the fixture here because we want a different deployment
		// 		const latestTime = BigInt(await time.latest());
		// 		await expect(
		// 			hre.viem.deployContract("Lock", [latestTime], {
		// 				value: 1n,
		// 			}),
		// 		).to.be.rejectedWith("Unlock time should be in the future");
		// 	});
		// });

		// describe("Withdrawals", function () {
		// 	describe("Validations", function () {
		// 		it("Should revert with the right error if called too soon", async function () {
		// 			const { lock } = await loadFixture(platformFixture);

		// 			await expect(lock.write.withdraw()).to.be.rejectedWith(
		// 				"You can't withdraw yet",
		// 			);
		// 		});

		// 		it("Should revert with the right error if called from another account", async function () {
		// 			const { lock, unlockTime, otherAccount } = await loadFixture(
		// 				platformFixture,
		// 			);

		// 			// We can increase the time in Hardhat Network
		// 			await time.increaseTo(unlockTime);

		// 			// We retrieve the contract with a different account to send a transaction
		// 			const lockAsOtherAccount = await hre.viem.getContractAt(
		// 				"Lock",
		// 				lock.address,
		// 				{ client: { wallet: otherAccount } },
		// 			);
		// 			await expect(lockAsOtherAccount.write.withdraw()).to.be.rejectedWith(
		// 				"You aren't the owner",
		// 			);
		// 		});

		// 		it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
		// 			const { lock, unlockTime } = await loadFixture(
		// 				platformFixture,
		// 			);

		// 			// Transactions are sent using the first signer by default
		// 			await time.increaseTo(unlockTime);

		// 			await expect(lock.write.withdraw()).to.be.fulfilled;
		// 		});
		// 	});

		// 	describe("Events", function () {
		// 		it("Should emit an event on withdrawals", async function () {
		// 			const { lock, unlockTime, lockedAmount, publicClient } =
		// 				await loadFixture(platformFixture);

		// 			await time.increaseTo(unlockTime);

		// 			const hash = await lock.write.withdraw();
		// 			await publicClient.waitForTransactionReceipt({ hash });

		// 			// get the withdrawal events in the latest block
		// 			const withdrawalEvents = await lock.getEvents.Withdrawal();
		// 			expect(withdrawalEvents).to.have.lengthOf(1);
		// 			expect(withdrawalEvents[0].args.amount).to.equal(lockedAmount);
		// 		});
		// 	});
	});
});
