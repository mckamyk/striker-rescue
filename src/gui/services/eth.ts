import {ethers, providers} from 'ethers';
import {LempiraCoin} from '../../types';
import {abi, address} from './lempira';
import {Subject} from 'rxjs';

declare const window: Window & typeof globalThis & {
  ethereum: any;
};

export let provider: providers.Web3Provider;
export let signer: providers.JsonRpcSigner;
export let contract: LempiraCoin;

export const connected = new Subject<boolean>();

export const connect = async (): Promise<true> => {
	if (!(await isConnected())) {
		await window.ethereum.request({method: 'eth_requestAccounts'});
	}

	setupAccounts();
	return true;
};

const setupAccounts = (prov?: providers.Web3Provider, sign?: providers.JsonRpcSigner): void => {
	if (prov) {
		provider = prov;
	} else {
		provider = new ethers.providers.Web3Provider(window.ethereum);
	}

	if (sign) {
		signer = sign;
	} else {
		signer = provider.getSigner();
	}

	contract = new ethers.Contract(address, abi, signer) as LempiraCoin;
	signer.getAddress()
		.then(() => {
			console.log('Connected.');
			connected.next(true);
		})
		.catch(() => {
			console.log('Not Connected.');
			connected.next(false);
		});
};

export const isConnected = async (): Promise<boolean> => {
	try {
		setupAccounts();
		await signer.getAddress();
	} catch (_) {
		connected.next(false);
		return false;
	}

	connected.next(true);
	return true;
};

setupAccounts();
