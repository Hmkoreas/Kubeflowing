/**
 * External dependencies
 */
import { View, Image } from 'react-native';
import { Component } from 'react';

export * from './react';
export * from './react-platform';
export * from './utils';
export { default as renderToString } from './serialize';
export { default as RawHTML } from './raw-html';

class GenericContainerElement extends Component {
	render() {
		const { children, ...rest } = this.props;
		return (
			<View { ...rest } >
				{ children }
			</View>
		);
	}
}

export const Div = GenericContainerElement;
export const Figure = GenericContainerElement;
export const Ul = GenericContainerElement;
export const Li = GenericContainerElement;
export const Figcaption = GenericContainerElement;

export class Img extends Component {
	render() {
		const { src: uri, ...rest } = this.props;
		return (
			<Image source={ { uri } } style={ { width: 100, height: 100 } } { ...rest } />
		);
	}
}
