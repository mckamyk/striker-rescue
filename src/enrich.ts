import fs from 'fs';
import fetch from 'node-fetch';
import {price} from './stuff';

const prices = JSON.parse(fs.readFileSync('prices.json').toString());
const infura = 'https://mainnet.infura.io/v3/7771eec4d31147a78b9c67a3ae6e32c8';
const from = '0xAB82910FE0a55E4Aa680DBc08bae45113566c309';
const to = '0xdcaad9fd9a74144d226dbf94ce6162ca9f09ed7e';
const methodString = '0xc87b56dd'

const enriched: any[] = [];

const enrich = async (price: price) => {
	const idString = price.id.toString(16).padStart(64, '0');

	const dataString = `${methodString}${idString}`;

	const callData = {
		jsonrpc: '2.0',
		method: "eth_call",
		params: [
			{
				from, to,
				data: dataString,
			},
			'latest'
		],
		id: 1,
	}

	try {
		const resp = await fetch(infura, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(callData),
		}).then((r) => r.json());

		const data = resp.result.slice(2);
		const url = encodeURI(`https://${Buffer.from(data, 'hex').toString().split('https://')[1]}`).split('%00')[0];
		console.log(url);

		try {
			const extra = await fetch(url).then((r) => r.json());
			enriched.push({
				...price, 
				extra
			})
		} catch {
			enriched.push({...price})
		}
	} catch {

	}
}

const proms = prices.map(async (price: price) => {
	return enrich(price);
});

Promise.all(proms).then(() => {
	fs.writeFileSync('enriched.json', JSON.stringify(enriched, undefined, 2))
})

