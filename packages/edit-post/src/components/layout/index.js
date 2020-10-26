/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	Popover,
	ScrollLock,
	FocusReturnProvider,
	navigateRegions,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	AutosaveMonitor,
	LocalAutosaveMonitor,
	UnsavedChangesWarning,
	EditorNotices,
	PostPublishPanel,
} from '@wordpress/editor';
import { BlockBreadcrumb } from '@wordpress/block-editor';
import { withDispatch, withSelect } from '@wordpress/data';
import { PluginArea } from '@wordpress/plugins';
import { withViewportMatch } from '@wordpress/viewport';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BrowserURL from '../browser-url';
import Header from '../header';
import TextEditor from '../text-editor';
import VisualEditor from '../visual-editor';
import EditorModeKeyboardShortcuts from '../keyboard-shortcuts';
import KeyboardShortcutHelpModal from '../keyboard-shortcut-help-modal';
import ManageBlocksModal from '../manage-blocks-modal';
import OptionsModal from '../options-modal';
import MetaBoxes from '../meta-boxes';
import SettingsSidebar from '../sidebar/settings-sidebar';
import Sidebar from '../sidebar';
import PluginPostPublishPanel from '../sidebar/plugin-post-publish-panel';
import PluginPrePublishPanel from '../sidebar/plugin-pre-publish-panel';
import FullscreenMode from '../fullscreen-mode';

function Layout( {
	mode,
	editorSidebarOpened,
	pluginSidebarOpened,
	publishSidebarOpened,
	hasFixedToolbar,
	closePublishSidebar,
	togglePublishSidebar,
	hasActiveMetaboxes,
	isSaving,
	isMobileViewport,
	isRichEditingEnabled,
	editingMode,
} ) {
	const sidebarIsOpened = editorSidebarOpened || pluginSidebarOpened || publishSidebarOpened;

	const className = classnames( 'edit-post-layout', 'is-mode-' + mode, {
		'is-sidebar-opened': sidebarIsOpened,
		'has-fixed-toolbar': hasFixedToolbar,
		'has-metaboxes': hasActiveMetaboxes,
	} );

	const publishLandmarkProps = {
		role: 'region',
		/* translators: accessibility text for the publish landmark region. */
		'aria-label': __( 'Editor publish' ),
		tabIndex: -1,
	};
	return (
		<FocusReturnProvider className={ className }>
			<FullscreenMode />
			<BrowserURL />
			<UnsavedChangesWarning />
			<AutosaveMonitor />
			<LocalAutosaveMonitor />
			<Header />
			<div
				className="edit-post-layout__content edit-post-layout__scrollable-container"
				role="region"
				/* translators: accessibility text for the content landmark region. */
				aria-label={ __( 'Editor content' ) }
				tabIndex="-1"
			>
				<EditorNotices />
				<EditorModeKeyboardShortcuts />
				<KeyboardShortcutHelpModal />
				<ManageBlocksModal />
				<OptionsModal />
				{ ( mode === 'text' || ! isRichEditingEnabled ) && <TextEditor /> }
				{ isRichEditingEnabled && mode === 'visual' && <VisualEditor noTitle={ editingMode === 'template' } /> }
				<div className="edit-post-layout__metaboxes">
					<MetaBoxes location="normal" />
				</div>
				<div className="edit-post-layout__metaboxes">
					<MetaBoxes location="advanced" />
				</div>
				{ isMobileViewport && sidebarIsOpened && <ScrollLock /> }
			</div>
			{ isRichEditingEnabled && mode === 'visual' && (
				<div
					className="edit-post-layout__footer"
					role="region"
					/* translators: accessibility text for the content landmark region. */
					aria-label={ __( 'Editor footer' ) }
					tabIndex="-1"
				>
					<BlockBreadcrumb />
				</div>
			) }
			{ publishSidebarOpened ? (
				<PostPublishPanel
					{ ...publishLandmarkProps }
					onClose={ closePublishSidebar }
					forceIsDirty={ hasActiveMetaboxes }
					forceIsSaving={ isSaving }
					PrePublishExtension={ PluginPrePublishPanel.Slot }
					PostPublishExtension={ PluginPostPublishPanel.Slot }
				/>
			) : (
				<>
					<div className="edit-post-toggle-publish-panel" { ...publishLandmarkProps }>
						<Button
							isDefault
							type="button"
							className="edit-post-toggle-publish-panel__button"
							onClick={ togglePublishSidebar }
							aria-expanded={ false }
						>
							{ __( 'Open publish panel' ) }
						</Button>
					</div>
					<SettingsSidebar />
					<Sidebar.Slot />
				</>
			) }
			<Popover.Slot />
			<PluginArea />
		</FocusReturnProvider>
	);
}

export default compose(
	withSelect( ( select ) => ( {
		mode: select( 'core/edit-post' ).getEditorMode(),
		editorSidebarOpened: select( 'core/edit-post' ).isEditorSidebarOpened(),
		pluginSidebarOpened: select( 'core/edit-post' ).isPluginSidebarOpened(),
		publishSidebarOpened: select( 'core/edit-post' ).isPublishSidebarOpened(),
		hasFixedToolbar: select( 'core/edit-post' ).isFeatureActive( 'fixedToolbar' ),
		hasActiveMetaboxes: select( 'core/edit-post' ).hasMetaBoxes(),
		isSaving: select( 'core/edit-post' ).isSavingMetaBoxes(),
		isRichEditingEnabled: select( 'core/editor' ).getEditorSettings().richEditingEnabled,
		editingMode: select( 'core/editor' ).getEditorSettings().editingMode,
	} ) ),
	withDispatch( ( dispatch ) => {
		const { closePublishSidebar, togglePublishSidebar } = dispatch( 'core/edit-post' );
		return {
			closePublishSidebar,
			togglePublishSidebar,
		};
	} ),
	navigateRegions,
	withViewportMatch( { isMobileViewport: '< small' } ),
)( Layout );
