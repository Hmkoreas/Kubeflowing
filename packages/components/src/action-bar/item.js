/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { useActionBarContext } from './context';
import FlexItem from '../flex/item';

export const defaultProps = {
	innerPadding: 'medium',
};

function ActionBarItem( props ) {
	const { className, ...restProps } = props;
	const mergedProps = { ...defaultProps, ...useActionBarContext(), ...props };
	const { innerPadding } = mergedProps;

	const classes = classnames(
		'components-action-bar__item',
		innerPadding && `is-innerPadding-${ innerPadding }`,
		className
	);

	return <FlexItem className={ classes } { ...restProps } />;
}

export default ActionBarItem;
