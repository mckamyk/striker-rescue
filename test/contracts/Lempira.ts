/* eslint-disable prefer-arrow-callback */
/* eslint-env mocha */
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';
import {LempiraCoin} from '../../src/types';

describe('Token Contract', function () {
	let signer: SignerWithAddress;
	let contract: LempiraCoin;
	before(async function () {
		[signer] = await ethers.getSigners();
		contract = await ethers.getContractFactory('LempiraCoin', signer).then(con => con.deploy()) as LempiraCoin;
	});
	it('Deploys', async function () {
		expect(contract && contract.address !== '');
	});
	it('Deploys with no supply', async () => {
		const supply = await contract.totalSupply();
		expect(supply.eq(0)).to.eq(true);
	});
	it('Can Mint', async () => {
		const bal = await contract.totalSupply();
		await contract.mint(await signer.getAddress(), 1000);
		const after = await contract.totalSupply();
		expect(bal.toNumber()).lessThan(after.toNumber());
	});
});

