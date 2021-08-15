import {LitElement, html, css} from 'lit';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {connect} from '#services/eth';
import Button from '../components/button';

export default class NotConnected extends scope(LitElement) {
	render() {
		return html`
			<div class="wrapper" part="wrapper">
				<div>You're not connected!</div>
				<lc-button @click=${connect}>Connect</lc-button>
			</div>
		`;
	}

	static styles = css`
		.wrapper {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
		}
	`;

	static get scopedElements() {
		return {
			'lc-button': Button,
		};
	}
}
