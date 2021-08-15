import {LitElement, html, css} from 'lit';
import {property, query} from 'lit/decorators.js';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {colors, fonts} from '../styles';

export default class TextField extends scope(LitElement) {
	@property({type: Boolean}) disabled = false;
	@property() label?: string;
	@property() value: string = '';
	@query('#input') input!: HTMLInputElement;

	updated(changes: Map<keyof TextField, any>) {
		if (changes.has('value')) {
			this.input.value = this.value;
		}
	}

	emit(ev: InputEvent) {
		const target = ev.target as HTMLInputElement;
		this.dispatchEvent(new CustomEvent<string>('change', {
			bubbles: true,
			composed: true,
			detail: target.value,
		}));
	}

	render() {
		return html`
			<div class="wrapper ${this.disabled ? 'disabled' : ''}">
				${this.label ? html`<div class="label">${this.label}</div>` : ''}
				<div class="field">
					<input type="text" @input=${this.emit} id="input" value=${this.value} ?readonly=${this.disabled} />
				</div>
			</div>
		`;
	}

	static styles = [colors, fonts, css`
		.label {
			font-size: .75rem;
			padding-left: 5px;
		}
		input {
			background: transparent;
			border: none;
		}
		input:focus {
			outline: none;
		}
		.wrapper {
			position: relative;
			border-bottom: 1px solid gray;
		}
		.wrapper.disabled {
			background: #333;
		}
		.field {
			height: 1.5rem;
			display: flex;
			align-items: center;
		}
		.field > * {
			flex-grow: 1;
		}
		.field::after {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 100%;
			margin: auto;
			width: 0;
			content: '';
			border-bottom: 1px solid var(--accent);
			transition: width 300ms ease-out;
		}
		.field:focus-within::after {
			width: 100%;
		}
	`];
}
