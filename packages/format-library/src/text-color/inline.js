/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createRef, useMemo } from '@wordpress/element';
import { select } from '@wordpress/data';
import {
	withSpokenMessages,
	ColorPalette,
} from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import {
	applyFormat,
	removeFormat,
	getActiveFormat,
} from '@wordpress/rich-text';
import {
	URLPopover,
	getColorClassName,
	getColorObjectByColorValue,
	getColorObjectByAttributeValues,
} from '@wordpress/block-editor';

export function getActiveColor( formatName, formatValue, colors ) {
	const activeColorFormat = getActiveFormat( formatValue, formatName );
	if ( ! activeColorFormat ) {
		return;
	}
	const styleColor = activeColorFormat.attributes.style;
	if ( styleColor ) {
		return styleColor.replace( new RegExp( `^color:\\s*` ), '' );
	}
	const currentClass = activeColorFormat.attributes.class;
	if ( currentClass ) {
		const colorSlug = currentClass.replace( /.*has-(.*?)-color.*/, '$1' );
		return getColorObjectByAttributeValues( colors, colorSlug ).color;
	}
}

const ColorPopoverAtLink = ( { isActive, addingColor, value, ...props } ) => {
	const anchorRect = useMemo( () => {
		const selection = window.getSelection();
		const range = selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingColor ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( 'span' );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [ isActive, addingColor, value.start, value.end ] );

	if ( ! anchorRect ) {
		return null;
	}

	return <URLPopover anchorRect={ anchorRect } { ...props } />;
};

class InlineColorUI extends Component {
	constructor() {
		super( ...arguments );

		this.onClickOutside = this.onClickOutside.bind( this );
		this.resetState = this.resetState.bind( this );
		this.autocompleteRef = createRef();

		this.state = {
			opensInNewWindow: false,
			inputValue: '',
		};
	}

	onClickOutside( event ) {
		const colorpicker = document.querySelector( '.components-color-palette__picker' );
		if ( ! colorpicker || ( colorpicker && ! colorpicker.contains( event.target ) ) ) {
			this.resetState();
		}
	}

	resetState() {
		this.props.onClose();
	}

	render() {
		const {
			name,
			value,
			onChange,
			isActive,
			addingColor,
		} = this.props;

		const isDisableCustomColors = get( select( 'core/block-editor' ).getSettings(), [ 'disableCustomColors' ], false );
		const colors = get( select( 'core/block-editor' ).getSettings(), [ 'colors' ], [] );

		const activeColor = getActiveColor( name, value, colors );
		return (
			<ColorPopoverAtLink
				value={ value }
				isActive={ isActive }
				addingColor={ addingColor }
				onClickOutside={ this.onClickOutside }
				onClose={ this.resetState }
				className="components-inline-color-popover"
			>
				<ColorPalette
					colors={ colors }
					value={ activeColor }
					disableCustomColors={ isDisableCustomColors }
					onChange={ ( color ) => {
						if ( color ) {
							const colorObject = getColorObjectByColorValue( colors, color );
							onChange(
								applyFormat( value, {
									type: name,
									attributes: colorObject ? {
										class: getColorClassName( 'color', colorObject.slug ),
									} : {
										style: `color:${ color }`,
									},
								} )
							);
						} else {
							onChange( removeFormat( value, name ) );
						}
					} }
				>
				</ColorPalette>
			</ColorPopoverAtLink>
		);
	}
}

export default withSpokenMessages( InlineColorUI );
