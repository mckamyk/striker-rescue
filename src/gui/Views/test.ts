import {LitElement, html, css} from 'lit';
import {colors, fonts} from '../styles';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import TextField from '../components/textfield';
import Button from '../components/button';
import {state} from '@lit/reactive-element/decorators/state';
import {ethers} from 'ethers';
import {signer} from '#services/eth';

const strikerAddressEncoded = '000000000000000000000000dcaad9fd9a74144d226dbf94ce6162ca9f09ed7e';
const strikerAddress = '0xdcaad9fd9a74144d226dbf94ce6162ca9f09ed7e';
const methodId = '0x8de93222';
const contractAddress = '0x78997e9e939daffe7eb9ed114fbf7128d0cfcd39';

declare const window: Window & typeof globalThis & {
  ethereum: any;
};

// @ts-ignore
import enriched from '../../../enriched.json';

export default class Test extends scope(LitElement) {
	@state() id: string = ''
	@state() price: string = '';
	@state() holderid: string = '';
	@state() holder: string = '';

	async buy() {
		const ether = ethers.utils.parseEther(this.price);
		const	id = Number(this.id).toString(16).padStart(64, '0');

		const dataString = `${methodId}${strikerAddressEncoded}${id}`;

		const params = {
			from: await signer.getAddress(),
			to: contractAddress,
			value: ether.toHexString(),
			data: dataString,
		};

		// Const body = {
		// 	jsonrpc: '2.0',
		// 	method: 'eth_sendTransaction',
		// 	id: 1,
		// 	params: [params],
		// };

		window.ethereum.request({method: 'eth_sendTransaction', params: [params]});
	}

	async check() {
		const id = Number(this.holderid).toString(16).padStart(64, '0');
		const dataString = `0x6352211e${id}`;

		const params = {
			from: await signer.getAddress(),
			to: strikerAddress,
			data: dataString,
		};

		const resp = await window.ethereum.request({method: 'eth_call', params: [params]});
		this.holder = resp;
	}

	render() {
		return html`
			<div class="wrapper">
				<pre class="pre">
					${JSON.stringify(enriched, undefined, 2)}
				</pre>
				<div class="card">
					holder: ${this.holder}
					<input-el label="Id" @change=${(ev: CustomEvent<string>) => this.holderid = ev.detail}></input-el>
					<button-el @click=${this.check}>Check Holder</button-el>
					<input-el label="id" @change=${(ev: CustomEvent<string>) => this.id = ev.detail}></input-el>
					<input-el label="ether" @change=${(ev: CustomEvent<string>) => this.price = ev.detail}></input-el>
					<button-el @click=${this.buy}>Buy</button-el>

				</div>
			</div>
		`;
	}

	static styles = [colors, fonts, css`
		.wrapper {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
		}
		.card {
			width: 25%;
			height: fit-content;
			box-shadow: 0 0 10px black;
			margin: 10px;
		}
		.pre {
			overflow-y: scroll;
			height: 80%;
		}
	`]

	static get scopedElements() {
		return {
			'input-el': TextField,
			'button-el': Button,
		};
	}
}
