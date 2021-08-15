import fetch from 'node-fetch';
import {BigNumber} from 'ethers';
import fs from 'fs';

const ids = [
	2942,99,1765,2389,4297,570,1130,1280,3099,4321,1568,4300,3016,4989,98,1893,2778,2949,4990,4461,1251,896,2712,854,3794,1786,1257,4959,4298,4988,1250,952,1792,4962,4299,1901,3106,1876,1759,1030,1252,1089,1032,1843,3348,893,1123,2930,1158,879,7016
]

const infura = 'https://mainnet.infura.io/v3/7771eec4d31147a78b9c67a3ae6e32c8';
const getCurrentPrice = '0x6c54df52';
const from = '0xAB82910FE0a55E4Aa680DBc08bae45113566c309';
const to = '0x78997e9e939daffe7eb9ed114fbf7128d0cfcd39';
const beneficiary = '000000000000000000000000dcaad9fd9a74144d226dbf94ce6162ca9f09ed7e';

export interface price {
	id: number;
	price: number;
}

const prices: price[] = [];

const getPrice = async (id: number) => {
	const idString = id.toString(16).padStart(64, '0');
	const dataString = `${getCurrentPrice}${beneficiary}${idString}`;

	const callData = {
		jsonrpc: '2.0',
		method: "eth_call",
		params: [
			{
				from, to,
				data: dataString
			},
			'latest'
		],
		id: 1,
	}

	const resp = await fetch(infura, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(callData),
	}).then((r) => r.json());

	const bigPrice = BigNumber.from(resp.result);
	const dec = BigNumber.from(10).pow(18);
	const price = bigPrice.div(dec).toNumber();

	prices.push({
		id, price
	})
}

const test = async () => {
	const callData = {
		jsonrpc: '2.0',
		method: "eth_call",
		params: [
			{
				from, to,
				data: '0x5c975abb'
			},
			'latest'
		],
		id: 1,
	}

	const resp = await fetch(infura, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(callData),
	}).then((r) => r.json());

	console.log(resp);
}
ids.forEach(async id => {
	await getPrice(id);

	fs.writeFileSync('prices.json', JSON.stringify(prices, undefined, 2));
});
// test();

