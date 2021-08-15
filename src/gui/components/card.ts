import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {LitElement, html, css} from 'lit';
import {property} from 'lit/decorators.js';
import {colors, fonts} from '../styles';

export default class Card extends scope(LitElement) {
	@property({type: Boolean}) header = false;
	@property({type: Boolean}) footer = false;

	render() {
		return html`
			<div class="wrapper" part="wrapper">
				${this.header ? html`
					<div class="header" part="header">
						<slot name="header"></slot>
					</div>
				` : ''}
				<div class="body" part="body">
					<slot></slot>
				</div>
				${this.footer ? html`
					<div class="footer" part="footer">
						<slot name="footer"></slot>
					</div>
				` : ''}
			</div>
		`;
	}

	static styles = [colors, fonts, css`
		.wrapper {
			display: flex;
			flex-flow: column nowrap;
			padding: 5px 10px;
			background: var(--low);
			height: 100%;
			box-sizing: border-box;
			box-shadow: 0 0 .5rem black;
		}
		.body {
			flex-grow: 1;
			padding: 10px 0;
		}
		.header {
			border-bottom: 1px solid white;
			padding-bottom: 5px;
			font-size: 2rem;
		}
		.footer {
			border-top: 1px solid white;
			padding-top: 5px;
		}
	`]
}
