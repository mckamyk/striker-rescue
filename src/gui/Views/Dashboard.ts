import {LitElement, html, css} from 'lit';
import {state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {colors, fonts} from '../styles';
import {BigNumber, ethers} from 'ethers';
import {deposit, withdraw, getTotalSupply, watchTotalSupply} from '../services/lempira';
import Button from '../components/button';
import Card from '../components/card';
import TextField from '../components/textfield';
import {Subject} from 'rxjs';

export default class Dashboard extends scope(LitElement) {
	@state() private totalSupply?: BigNumber;
	@state() private supplySubject: Subject<BigNumber> = watchTotalSupply();

	@state() private depositAmount: string = '';
	@state() private depositAddress: string = '';
	@state() private withdrawAmount: string = '';
	@state() private withdrawAddress: string = '';

	constructor() {
		super();
		this.getTotalSupply();
		this.supplySubject.subscribe({
			next: amount => this.totalSupply = amount,
		});
	}

	async getTotalSupply() {
		this.totalSupply = await getTotalSupply();
	}

	deposit() {
		deposit(this.depositAmount, this.depositAddress);
		this.depositAmount = '';
		this.depositAddress = '';
	}

	widthdraw() {
		withdraw(this.withdrawAmount, this.withdrawAddress);
		this.withdrawAmount = '';
		this.withdrawAddress = '';
	}

	render() {
		return html`
			<div class="wrapper">
				<lc-card class="card" header footer>
					<div class="totalSupplyHeader" slot="header">
						Total Supply
					</div>
					<div class="totalSupply">
						$ ${Number(ethers.utils.formatEther(this.totalSupply || 0)).toLocaleString()}
					</div>
					<div class="totalSupplyFooter" slot="footer">
						<lc-button @click=${this.getTotalSupply}>Refresh</lc-button>
					</div>
				</lc-card>
				<div class="actions">
					<lc-card class="deposit" footer>
						<div class="depositBody">
							<lc-textfield value=${ifDefined(this.depositAmount)} label="Amount" @change=${(ev: CustomEvent<string>) => this.depositAmount = ev.detail}></lc-textfield>
							<lc-textfield value=${ifDefined(this.depositAddress)} label="Address" @change=${(ev: CustomEvent<string>) => this.depositAddress = ev.detail}></lc-textfield>
						</div>
						<div class="footer" slot="footer">
							<lc-button @click=${this.deposit}>Deposit</lc-button>
						</div>
					</lc-card>
					<lc-card class="withdraw" footer>
						<div class="withdrawBody">
							<lc-textfield value=${ifDefined(this.withdrawAmount)} label="Amount" @change=${(ev: CustomEvent<string>) => this.withdrawAmount = ev.detail}></lc-textfield>
							<lc-textfield value=${ifDefined(this.withdrawAddress)} label="Address" @change=${(ev: CustomEvent<string>) => this.withdrawAddress = ev.detail}></lc-textfield>
						</div>
						<div class="footer" slot="footer">
							<lc-button @click=${this.widthdraw}>Withdraw</lc-button>
						</div>
					</lc-card>
				</div>
			</div>
		`;
	}

	static styles = [colors, fonts, css`
		.wrapper {
			height: 100%;
			display: flex;
			flex-flow: column nowrap;
			align-items: center;
			justify-content: center;
		}
		.wrapper > *:not(:last-child) {
			margin-bottom: 1rem;
		}
		.card {
			max-width: 40rem;
			width: 80vw;
		}
		.totalSupplyHeader, .totalSupplyFooter {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.totalSupply {
			font-size: 4rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.actions {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.deposit {
			margin-right: 1rem;
		}
		.depositBody, .withdrawBody {
			display: flex;
		}
		.depositBody > *:not(:last-child), .withdrawBody > *:not(:last-child) {
			margin-right: 1rem;
		}
		.footer {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`];

	static get scopedElements() {
		return {
			'lc-button': Button,
			'lc-card': Card,
			'lc-textfield': TextField,
		};
	}
}
