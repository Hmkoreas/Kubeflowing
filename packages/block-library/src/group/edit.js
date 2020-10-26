/**
 * External dependencies
 */
import classnames from 'classnames';
import { partialRight } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	DimensionControl,
	InspectorControls,
	InnerBlocks,
	PanelColorSettings,
	withColors,
} from '@wordpress/block-editor';

function TestDimensionControl() {
	const [ dimensions, setDimensions ] = useState( {} );
	const { paddingSize } = dimensions;

	const updateSpacing = ( dimension, size, device = '' ) => {
		setDimensions( {
			...dimensions,
			[ `${ dimension }${ device }` ]: size,
		} );
	};
	const resetSpacingDimension = ( dimension, device = '' ) => {
		setDimensions( {
			...dimensions,
			[ `${ dimension }${ device }` ]: '',
		} );
	};
	return (
		<DimensionControl
			label={ __( 'Padding' ) }
			icon={ 'desktop' }
			onReset={ partialRight( resetSpacingDimension, 'paddingSize' ) }
			onSpacingChange={ partialRight( updateSpacing, 'paddingSize' ) }
			currentSize={ paddingSize }
		/>
	);
}

function GroupEdit( {
	className,
	setBackgroundColor,
	backgroundColor,
	hasInnerBlocks,
} ) {
	const styles = {
		backgroundColor: backgroundColor.color,
	};

	const classes = classnames( className, backgroundColor.class, {
		'has-background': !! backgroundColor.color,
	} );

	return (
		<>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color' ),
						},
					] }
				/>
				<TestDimensionControl />
			</InspectorControls>
			<div className={ classes } style={ styles }>
				<div className="wp-block-group__inner-container">
					<InnerBlocks
						renderAppender={ ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</div>
		</>
	);
}

export default compose( [
	withColors( 'backgroundColor' ),
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );

		const block = getBlock( clientId );

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		};
	} ),
] )( GroupEdit );
