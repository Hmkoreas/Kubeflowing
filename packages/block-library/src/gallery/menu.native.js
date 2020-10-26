/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { leftArrow, rightArrow } from './icons';

const Menu = ( { isFirstItem, isLastItem, isSelected, onRemove, onMoveForward, onMoveBackward } ) => {
	return (
		<>
			<View
				style={ {
					position: 'absolute',
				} }>
				<IconButton
					icon="arrow-left"
					onClick={ isFirstItem ? undefined : onMoveBackward }
					label={ __( 'Move Image Backward' ) }
					aria-disabled={ isFirstItem }
					disabled={ ! isSelected }
				/>
				<IconButton
					icon="arrow-right"
					onClick={ isLastItem ? undefined : onMoveForward }
					label={ __( 'Move Image Forward' ) }
					aria-disabled={ isLastItem }
					disabled={ ! isSelected }
				/>
			</View>
			<View
				style={ {
					position: 'absolute',
					right: 0,
				} }>
				<IconButton
					icon="no-alt"
					onClick={ onRemove }
					label={ __( 'Remove Image' ) }
					disabled={ ! isSelected }
				/>
			</View>
		</>
	);
};

export default Menu;
