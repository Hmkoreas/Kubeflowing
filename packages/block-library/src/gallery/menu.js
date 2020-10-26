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
			<div className="block-library-gallery-item__move-menu">
				<IconButton
					icon={ leftArrow }
					onClick={ isFirstItem ? undefined : onMoveBackward }
					className="blocks-gallery-item__move-backward"
					label={ __( 'Move image backward' ) }
					aria-disabled={ isFirstItem }
					disabled={ ! isSelected }
				/>
				<IconButton
					icon={ rightArrow }
					onClick={ isLastItem ? undefined : onMoveForward }
					className="blocks-gallery-item__move-forward"
					label={ __( 'Move image forward' ) }
					aria-disabled={ isLastItem }
					disabled={ ! isSelected }
				/>
			</div>
			<div className="block-library-gallery-item__inline-menu">
				<IconButton
					icon="no-alt"
					onClick={ onRemove }
					className="blocks-gallery-item__remove"
					label={ __( 'Remove image' ) }
					disabled={ ! isSelected }
				/>
			</div>
		</>
	);
};

export default Menu;
