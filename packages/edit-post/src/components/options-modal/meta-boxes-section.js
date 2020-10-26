/**
 * External dependencies
 */
import { filter, get, map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Section from './section';
import { EnableCustomFieldsOption, EnablePanelOption } from './options';

export function MetaBoxesSection( { metaBoxes, supportsCustomFields, ...sectionProps } ) {
	// The 'Custom Fields' meta box is a special case that we handle separately.
	const thirdPartyMetaBoxes = filter( metaBoxes, ( { id } ) => id !== 'postcustom' );

	if ( ! supportsCustomFields && thirdPartyMetaBoxes.length === 0 ) {
		return null;
	}

	return (
		<Section { ...sectionProps }>
			{ supportsCustomFields && <EnableCustomFieldsOption label={ __( 'Custom Fields' ) } /> }
			{ map( thirdPartyMetaBoxes, ( { id, title } ) => (
				<EnablePanelOption key={ id } label={ title } panelName={ `meta-box-${ id }` } />
			) ) }
		</Section>
	);
}

export default withSelect( ( select ) => {
	const { getPostType } = select( 'core' );
	const { getEditedPostAttribute } = select( 'core/editor' );
	const { getAllMetaBoxes } = select( 'core/edit-post' );
	const postType = getPostType( getEditedPostAttribute( 'type' ) );

	return {
		metaBoxes: getAllMetaBoxes(),
		supportsCustomFields: get( postType, [ 'supports', 'custom-fields' ], false ),
	};
} )( MetaBoxesSection );
