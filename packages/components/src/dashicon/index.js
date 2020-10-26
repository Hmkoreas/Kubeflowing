/* !!!
IF YOU ARE EDITING dashicon/index.jsx
THEN YOU ARE EDITING A FILE THAT GETS OUTPUT FROM THE DASHICONS REPO!
DO NOT EDIT THAT FILE! EDIT index-header.jsx and index-footer.jsx instead
OR if you're looking to change now SVGs get output, you'll need to edit strings in the Gruntfile :)
!!! */

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Path, SVG } from '../primitives';
import { getIconClassName } from './icon-class';
import { iconsObject } from './icons-object';
class Dashicon extends Component {
	render() {
		const { icon, size = 20, className, ariaPressed, ...extraProps } = this.props;
		const path = iconsObject[ icon ];
		if ( ! path ) {
			return null;
		}

		const iconClass = getIconClassName( icon, className, ariaPressed );

		return (
			<SVG
				aria-hidden
				role="img"
				focusable="false"
				className={ iconClass }
				xmlns="http://www.w3.org/2000/svg"
				width={ size }
				height={ size }
				viewBox="0 0 20 20"
				{ ...extraProps }
			>
				<Path d={ path } />
			</SVG>
		);
	}
}

export default Dashicon;
export * from './icons-object';
