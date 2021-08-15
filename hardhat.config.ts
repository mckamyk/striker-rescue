import {task, HardhatUserConfig} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import 'hardhat-watcher';
import * as fs from 'fs';
import * as path from 'path';

export const walletAddress = '0xAB82910FE0a55E4Aa680DBc08bae45113566c309';

task('dev', 'Main Development Task', async (args, hre) => {
	const watchProm = hre.run('watch', {watcherTask: 'rebuild'});

	hre.run('node');
	await hre.run('compile');
	await hre.run('init');

	await watchProm;
});

task('init', 'Initialized the contract state, and updates address reference', async (args, hre: HardhatRuntimeEnvironment) => {
	const {ethers} = hre;

	hre.network.provider.request({
		method: 'hardhat_impersonateAccount',
		params: [walletAddress],
	});

	const signer = ethers.provider.getSigner(walletAddress);
	const balance = await signer.getBalance();
	console.log(`Main Wallet: ${ethers.utils.formatEther(balance)}`);
	if (balance.lt(ethers.utils.parseEther('100'))) {
		const internalAccounts = await ethers.getSigners();
		const internalBalance = await internalAccounts[0].getBalance();
		if (internalBalance.gte(ethers.utils.parseEther('100'))) {
			await internalAccounts[0].sendTransaction({to: walletAddress, value: ethers.utils.parseEther('100')});
		}
	}

	const lempiraFactory = await ethers.getContractFactory('LempiraCoin', signer);
	const lempira = await lempiraFactory.deploy();

	const out = {address: lempira.address};
	fs.writeFileSync(path.join(__dirname, 'src', 'address.json'), JSON.stringify(out));
});

const config: HardhatUserConfig = {
	solidity: '0.8.4',
	networks: {
		hardhat: {
			forking: {
				url: 'https://eth-mainnet.alchemyapi.io/v2/V0nBEYPNRBYaZmLGh9psiWwTDwGEXlk7',
				blockNumber: 13031883,
			},
			logging: {
				omitMethods: ['eth_chainId', 'eth_blockNumber', 'eth_getFilterChanges'],
			},
			initialBaseFeePerGas: 0,
		},
	},
	watcher: {
		rebuild: {
			tasks: ['compile', 'init'],
		},
	},
	typechain: {
		outDir: './src/types',
	},
	paths: {
		sources: './src/contracts',
	},
};

export default config;
