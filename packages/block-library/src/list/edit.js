/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	TextControl,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import SharedListEdit from './edit.shared';

const inspectorControls = ( props ) => {
	const { attributes, setAttributes } = props;
	const { ordered, reversed, start } = attributes;

	return ordered && (
		<InspectorControls>
			<PanelBody title={ __( 'Ordered List Settings' ) }>
				<TextControl
					label={ __( 'Start Value' ) }
					type="number"
					onChange={ ( value ) => {
						const int = parseInt( value, 10 );

						setAttributes( {
							// It should be possible to unset the value,
							// e.g. with an empty string.
							start: isNaN( int ) ? undefined : int,
						} );
					} }
					value={ Number.isInteger( start ) ? start.toString( 10 ) : '' }
					step="1"
				/>
				<ToggleControl
					label={ __( 'Reverse List Numbering' ) }
					checked={ reversed || false }
					onChange={ ( value ) => {
						setAttributes( {
							// Unset the attribute if not reversed.
							reversed: value || undefined,
						} );
					} }
				/>
			</PanelBody>
		</InspectorControls> );
};

export default function ListEdit( props ) {
	return (
		<SharedListEdit
			{ ...props }
			inspectorControls={ inspectorControls( props ) }
		/> );
}
