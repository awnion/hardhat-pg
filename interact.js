const Web3 = require('web3');
const { abi } = require('./PlatformABI.json'); // Assuming you have the ABI saved in this file
const web3 = new Web3('http://127.0.0.1:8545/'); // Replace with your Infura project ID or other provider

// Replace with your wallet private key
const privateKey = 'YOUR_PRIVATE_KEY';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Contract address (replace with the deployed contract address)
const contractAddress = '0xYourContractAddress';

// Instantiate the contract
const platformContract = new web3.eth.Contract(abi, contractAddress);

// Function to call giveAllowance
async function giveAllowance() {
    try {
        const gas = await platformContract.methods.giveAllowance().estimateGas({ from: account.address });

        const result = await platformContract.methods.giveAllowance().send({
            from: account.address,
            gas: gas,
        });

        console.log('Transaction successful:', result.transactionHash);
    } catch (error) {
        console.error('Error executing transaction:', error);
    }
}

// Execute the function
giveAllowance();
