// @ts-ignore
import lempira from '#artifacts/src/contracts/lempiracoin.sol/LempiraCoin.json';
import {BigNumber, ethers} from 'ethers';
import {Subject} from 'rxjs';
// @ts-ignore
import addr from '../../address';

export const {abi} = lempira;
export const {address} = addr;

import {contract} from './eth';

export const getTotalSupply = async (): Promise<BigNumber> => contract.totalSupply();

export const deposit = async (amount: string, address: string) => {
	const amt = ethers.utils.parseEther(amount);
	contract.deposit(address, amt);
};

export const withdraw = async (amount:string, address: string) => {
	const amt = ethers.utils.parseEther(amount);
	contract.withdraw(address, amt);
};

export const watchTotalSupply = () => {
	const supply = new Subject<BigNumber>();
	contract.on('Transfer', async (from: string, to: string) => {
		const zero = '0x0000000000000000000000000000000000000000';
		if (from === zero || to === zero) {
			const sup = await getTotalSupply();
			supply.next(sup);
		}
	});
	return supply;
};
