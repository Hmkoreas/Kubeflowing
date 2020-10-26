/**
 * External dependencies
 */
import Textarea from 'react-autosize-textarea';
import classnames from 'classnames';
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { ENTER } from '@wordpress/keycodes';
import { withSelect, withDispatch } from '@wordpress/data';
import { KeyboardShortcuts, withFocusOutside } from '@wordpress/components';
import { withInstanceId, compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import PostPermalink from '../post-permalink';
import PostTypeSupportCheck from '../post-type-support-check';

/**
 * Constants
 */
const REGEXP_NEWLINES = /[\r\n]+/g;

class PostTitle extends Component {
	constructor() {
		super( ...arguments );

		this.onChange = this.onChange.bind( this );
		this.onSelect = this.onSelect.bind( this );
		this.onUnselect = this.onUnselect.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.redirectHistory = this.redirectHistory.bind( this );

		this.state = {
			isSelected: false,
		};
	}

	handleFocusOutside() {
		this.onUnselect();
	}

	onSelect() {
		this.setState( { isSelected: true } );
		this.props.clearSelectedBlock();
	}

	onUnselect() {
		this.setState( { isSelected: false } );
	}

	onChange( event ) {
		const newTitle = event.target.value.replace( REGEXP_NEWLINES, ' ' );
		this.props.onUpdate( newTitle );
	}

	onKeyDown( event ) {
		if ( event.keyCode === ENTER ) {
			event.preventDefault();
			this.props.onEnterPress();
		}
	}

	/**
	 * Emulates behavior of an undo or redo on its corresponding key press
	 * combination. This is a workaround to React's treatment of undo in a
	 * controlled textarea where characters are updated one at a time.
	 * Instead, leverage the store's undo handling of title changes.
	 *
	 * @see https://github.com/facebook/react/issues/8514
	 *
	 * @param {KeyboardEvent} event Key event.
	 */
	redirectHistory( event ) {
		if ( event.shiftKey ) {
			this.props.onRedo();
		} else {
			this.props.onUndo();
		}

		event.preventDefault();
	}

	render() {
		const {
			hasFixedToolbar,
			isCleanNewPost,
			isFocusMode,
			isPostTypeViewable,
			instanceId,
			placeholder,
			title,
		} = this.props;
		const { isSelected } = this.state;

		// The wp-block className is important for editor styles.
		const className = classnames( 'wp-block editor-post-title__block', {
			'is-selected': isSelected,
			'is-focus-mode': isFocusMode,
			'has-fixed-toolbar': hasFixedToolbar,
		} );
		const decodedPlaceholder = decodeEntities( placeholder );

		return (
			<PostTypeSupportCheck supportKeys="title">
				<div className="editor-post-title">
					<div className={ className }>
						<KeyboardShortcuts
							shortcuts={ {
								'mod+z': this.redirectHistory,
								'mod+shift+z': this.redirectHistory,
							} }
						>
							<label htmlFor={ `post-title-${ instanceId }` } className="screen-reader-text">
								{ decodedPlaceholder || __( 'Add title' ) }
							</label>
							<Textarea
								id={ `post-title-${ instanceId }` }
								className="editor-post-title__input"
								value={ title }
								onChange={ this.onChange }
								placeholder={ decodedPlaceholder || __( 'Add title' ) }
								onFocus={ this.onSelect }
								onKeyDown={ this.onKeyDown }
								onKeyPress={ this.onUnselect }
								/*
									Only autofocus the title when the post is entirely empty.
									This should only happen for a new post, which means we
									focus the title on new post so the author can start typing
									right away, without needing to click anything.
								*/
								/* eslint-disable jsx-a11y/no-autofocus */
								autoFocus={ isCleanNewPost }
								/* eslint-enable jsx-a11y/no-autofocus */
							/>
						</KeyboardShortcuts>
						{ isSelected && isPostTypeViewable && <PostPermalink /> }
					</div>
				</div>
			</PostTypeSupportCheck>
		);
	}
}

const applyWithSelect = withSelect( ( select ) => {
	const { getEditedPostAttribute, isCleanNewPost } = select( 'core/editor' );
	const { getSettings } = select( 'core/block-editor' );
	const { getPostType } = select( 'core' );
	const postType = getPostType( getEditedPostAttribute( 'type' ) );
	const { titlePlaceholder, focusMode, hasFixedToolbar } = getSettings();

	return {
		isCleanNewPost: isCleanNewPost(),
		title: getEditedPostAttribute( 'title' ),
		isPostTypeViewable: get( postType, [ 'viewable' ], false ),
		placeholder: titlePlaceholder,
		isFocusMode: focusMode,
		hasFixedToolbar,
	};
} );

const applyWithDispatch = withDispatch( ( dispatch ) => {
	const {
		insertDefaultBlock,
		clearSelectedBlock,
	} = dispatch( 'core/block-editor' );
	const {
		editPost,
		undo,
		redo,
	} = dispatch( 'core/editor' );

	return {
		onEnterPress() {
			insertDefaultBlock( undefined, undefined, 0 );
		},
		onUpdate( title ) {
			editPost( { title } );
		},
		onUndo: undo,
		onRedo: redo,
		clearSelectedBlock,
	};
} );

export default compose(
	applyWithSelect,
	applyWithDispatch,
	withInstanceId,
	withFocusOutside
)( PostTitle );
