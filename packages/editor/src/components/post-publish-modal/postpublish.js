/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */

import { Button, TextControl, ClipboardButton } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { Component, createRef } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { safeDecodeURIComponent } from '@wordpress/url';

class PostPublishModalPostpublish extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			showCopyConfirmation: false,
		};
		this.onCopy = this.onCopy.bind( this );
		this.postLink = createRef();
	}

	componentWillUnmount() {
		clearTimeout( this.dismissCopyConfirmation );
	}

	onCopy() {
		this.setState( {
			showCopyConfirmation: true,
		} );

		clearTimeout( this.dismissCopyConfirmation );
		this.dismissCopyConfirmation = setTimeout( () => {
			this.setState( {
				showCopyConfirmation: false,
			} );
		}, 4000 );
	}

	render() {
		const { children, isScheduled, post, postType } = this.props;
		const postLabel = get( postType, [ 'labels', 'singular_name' ] );
		const viewPostLabel = get( postType, [ 'labels', 'view_item' ] );

		return (
			<div className="editor-editor-post-publish-modal__prepublish">
				<p className="editor-post-publish-modal__postpublish-post-text">
					{
						sprintf(
							/* translators: %s: post type singular name */
							__( 'Great Work! You\'ve just published your first %s. You can review it here to check for any mistakes, or start on a new %s.' ), postLabel, postLabel
						)
					}
				</p>
				<div className="editor-post-publish-modal__postpublish-post-address">
					<TextControl
						disabled
						className="editor-post-publish-modal__postpublish-post-url"
						label={
							sprintf(
								/* translators: %s: post type singular name */
								__( 'Link to your %s:' ), postLabel
							)
						}
						value={ safeDecodeURIComponent( post.link ) }
					/>
					<ClipboardButton
						isDefault
						isLarge
						className="editor-post-publish-modal__postpublish-post-copy"
						text={ post.link }
						onCopy={ this.onCopy }
					>
						{ this.state.showCopyConfirmation ? __( 'Copied!' ) : __( 'Copy Link' ) }
					</ClipboardButton>
				</div>
				{ ! isScheduled && (
					<div className="editor-post-publish-modal__postpublish-controls">
						<Button
							href={ post.link }
							isPrimary
							isLarge
						>
							{ viewPostLabel }
						</Button>
					</div>
				) }
				{ children }
			</div>
		);
	}
}

export default withSelect( ( select ) => {
	const { getEditedPostAttribute, getCurrentPost, isCurrentPostScheduled } = select( 'core/editor' );
	const { getPostType } = select( 'core' );

	return {
		post: getCurrentPost(),
		postType: getPostType( getEditedPostAttribute( 'type' ) ),
		isScheduled: isCurrentPostScheduled(),
	};
} )( PostPublishModalPostpublish );
