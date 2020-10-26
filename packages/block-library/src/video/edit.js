/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { getBlobByURL, isBlobURL } from '@wordpress/blob';
import {
	BaseControl,
	Button,
	Disabled,
	IconButton,
	PanelBody,
	Path,
	Rect,
	SelectControl,
	SVG,
	ToggleControl,
	Toolbar,
	withNotices,
} from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { mediaUpload } from '@wordpress/editor';
import { Component, createRef } from '@wordpress/element';
import {
	__,
	sprintf,
} from '@wordpress/i18n';
import {
	compose,
	withInstanceId,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
//import { createUpgradedEmbedBlock } from '../embed/util'; TODO: implement embed fallback
import icon from './icon';

const ALLOWED_MEDIA_TYPES = [ 'video' ];
const VIDEO_POSTER_ALLOWED_MEDIA_TYPES = [ 'image' ];

class VideoEdit extends Component {
	constructor() {
		super( ...arguments );
		// edit component has its own src in the state so it can be edited
		// without setting the actual value outside of the edit UI
		this.state = {
			editing: ! this.props.attributes.sources.length,
		};

		this.videoPlayer = createRef();
		this.posterImageButton = createRef();
		this.onAddSource = this.onAddSource.bind( this );
		this.toggleAttribute = this.toggleAttribute.bind( this );
		this.onSelectURL = this.onSelectURL.bind( this );
		this.onSelectPoster = this.onSelectPoster.bind( this );
		this.onRemovePoster = this.onRemovePoster.bind( this );
	}

	componentDidMount() {
		const { attributes, noticeOperations, setAttributes } = this.props;
		const { id, src = '' } = attributes;
		if ( ! id && isBlobURL( src ) ) {
			const file = getBlobByURL( src );
			if ( file ) {
				mediaUpload( {
					filesList: [ file ],
					onFileChange: ( [ { url } ] ) => {
						setAttributes( { src: url } );
					},
					onError: ( message ) => {
						this.setState( { editing: true } );
						noticeOperations.createErrorNotice( message );
					},
					allowedTypes: ALLOWED_MEDIA_TYPES,
				} );
			}
		}
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.attributes.poster !== prevProps.attributes.poster ) {
			this.videoPlayer.current.load();
		}
	}

	onAddSource( media ) {
		const { setAttributes, attributes } = this.props;
		const src = media.url !== undefined ? media.url : media;
		const type = media.mime || this.getVideoMimeType( src );
		setAttributes( {
			sources: [ ...attributes.sources, { src, type } ],
		} );
		this.setState( { editing: false } );
	}

	removeSource( src ) {
		const { attributes: { sources }, setAttributes } = this.props;
		const filteredSources = sources.filter( ( source ) => source.src !== src );
		setAttributes( {
			sources: filteredSources,
		} );
	}

	getVideoMimeType( url ) {
		// wp.media.view.settings.embedMimes
		const fileType = url.split( '.' ).pop();
		let mime;
		switch ( fileType ) {
			case 'mp4':
				mime = 'video/mp4';
				break;
			case 'webm':
				mime = 'video/webm';
				break;
			case 'ogv':
				mime = 'video/ogg';
				break;
			default:
				mime = 'undefined';
		}
		return mime;
	}

	toggleAttribute( attribute ) {
		return ( newValue ) => {
			this.props.setAttributes( { [ attribute ]: newValue } );
		};
	}

	onSelectURL( src ) {
		const { setAttributes, attributes } = this.props;
		const type = this.getVideoMimeType( src );
		setAttributes( {
			sources: [ ...attributes.sources, { src, type } ],
		} );

		this.setState( { editing: false } );
	}

	onSelectPoster( image ) {
		const { setAttributes } = this.props;
		setAttributes( { poster: image.url } );
	}

	onRemovePoster() {
		const { setAttributes } = this.props;
		setAttributes( { poster: '' } );

		// Move focus back to the Media Upload button.
		this.posterImageButton.current.focus();
	}

	getAutoplayHelp( checked ) {
		return checked ? __( 'Note: Autoplaying videos may cause usability issues for some visitors.' ) : null;
	}

	render() {
		const {
			autoplay,
			caption,
			controls,
			loop,
			muted,
			playsInline,
			poster,
			preload,
			sources,
		} = this.props.attributes;
		const {
			className,
			instanceId,
			isSelected,
			noticeOperations,
			noticeUI,
			setAttributes,
		} = this.props;
		const { editing } = this.state;
		const switchToEditing = () => {
			this.setState( { editing: ! this.state.editing } );
		};

		const editImageIcon = ( <SVG width={ 20 } height={ 20 } viewBox="0 0 20 20"><Rect x={ 11 } y={ 3 } width={ 7 } height={ 5 } rx={ 1 } /><Rect x={ 2 } y={ 12 } width={ 7 } height={ 5 } rx={ 1 } /><Path d="M13,12h1a3,3,0,0,1-3,3v2a5,5,0,0,0,5-5h1L15,9Z" /><Path d="M4,8H3l2,3L7,8H6A3,3,0,0,1,9,5V3A5,5,0,0,0,4,8Z" /></SVG> );
		if ( editing || ! sources.length ) {
			return (
				<>
					<BlockControls>
						{ !! sources.length && ( <Toolbar>
							<IconButton
								className={ classnames( 'components-icon-button components-toolbar__control', { 'is-active': this.state.editing } ) }
								aria-pressed={ this.state.editing }
								label={ __( 'Edit video' ) }
								onClick={ switchToEditing }
								icon={ editImageIcon }
							/>
						</Toolbar> ) }
					</BlockControls>
					<MediaPlaceholder
						icon={ <BlockIcon icon={ icon } /> }
						className={ className }
						onSelect={ this.onAddSource }
						onSelectURL={ this.onSelectURL }
						onCancel={ !! sources.length && switchToEditing }
						accept="video/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ this.props.attributes }
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</>
			);
		}
		const videoPosterDescription = `video-block__poster-image-description-${ instanceId }`;

		/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<>
				<BlockControls>
					<Toolbar>
						<IconButton
							className="components-icon-button components-toolbar__control"
							label={ __( 'Add alternative source' ) }
							onClick={ switchToEditing }
							icon={ editImageIcon }
						/>
					</Toolbar>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Video Settings' ) }>
						<ToggleControl
							label={ __( 'Autoplay' ) }
							onChange={ this.toggleAttribute( 'autoplay' ) }
							checked={ autoplay }
							help={ this.getAutoplayHelp }
						/>
						<ToggleControl
							label={ __( 'Loop' ) }
							onChange={ this.toggleAttribute( 'loop' ) }
							checked={ loop }
						/>
						<ToggleControl
							label={ __( 'Muted' ) }
							onChange={ this.toggleAttribute( 'muted' ) }
							checked={ muted }
						/>
						<ToggleControl
							label={ __( 'Playback Controls' ) }
							onChange={ this.toggleAttribute( 'controls' ) }
							checked={ controls }
						/>
						<ToggleControl
							label={ __( 'Play inline' ) }
							onChange={ this.toggleAttribute( 'playsInline' ) }
							checked={ playsInline }
						/>
						<SelectControl
							label={ __( 'Preload' ) }
							value={ preload }
							onChange={ ( value ) => setAttributes( { preload: value } ) }
							options={ [
								{ value: 'auto', label: __( 'Auto' ) },
								{ value: 'metadata', label: __( 'Metadata' ) },
								{ value: 'none', label: __( 'None' ) },
							] }
						/>
						<MediaUploadCheck>
							<BaseControl
								className="editor-video-poster-control"
							>
								<BaseControl.VisualLabel>
									{ __( 'Poster Image' ) }
								</BaseControl.VisualLabel>
								<MediaUpload
									title={ __( 'Select Poster Image' ) }
									onSelect={ this.onSelectPoster }
									allowedTypes={ VIDEO_POSTER_ALLOWED_MEDIA_TYPES }
									render={ ( { open } ) => (
										<Button
											isDefault
											onClick={ open }
											ref={ this.posterImageButton }
											aria-describedby={ videoPosterDescription }
										>
											{ ! this.props.attributes.poster ? __( 'Select Poster Image' ) : __( 'Replace image' ) }
										</Button>
									) }
								/>
								<p
									id={ videoPosterDescription }
									hidden
								>
									{ this.props.attributes.poster ?
										sprintf( __( 'The current poster image url is %s' ), this.props.attributes.poster ) :
										__( 'There is no poster image currently selected' )
									}
								</p>
								{ !! this.props.attributes.poster &&
									<Button onClick={ this.onRemovePoster } isLink isDestructive>
										{ __( 'Remove Poster Image' ) }
									</Button>
								}
							</BaseControl>
						</MediaUploadCheck>
					</PanelBody>
				</InspectorControls>
				<figure className={ className }>
					{ /*
						Disable the video tag so the user clicking on it won't play the
						video when the controls are enabled.
					*/ }
					<Disabled>
						<video
							controls={ controls }
							poster={ poster }
							ref={ this.videoPlayer }
						>
							{ sources.map( ( source ) => {
								return (
									<source
										key={ source.src }
										src={ source.src }
										type={ source.type }
									/>
								);
							} ) }
						</video>
					</Disabled>
					{ ( ! RichText.isEmpty( caption ) || isSelected ) && (
						<RichText
							tagName="figcaption"
							placeholder={ __( 'Write caption…' ) }
							value={ caption }
							onChange={ ( value ) => setAttributes( { caption: value } ) }
							inlineToolbar
						/>
					) }
				</figure>
				{ ( !! sources.length && isSelected ) && (
					<>
						<b>{ __( 'Sources:' ) }</b>
						<p>{ __( 'You can add fallback files for for maximum HTML playback:' ) }</p>
						<ul>
							{ sources.map( ( source ) => {
								return (
									<li key={ source.src } className="source-file">
										{ source.src.substring( source.src.lastIndexOf( '/' ) + 1 ) }{ ' ' }
										<Button
											isLink
											className="is-destructive"
											onClick={ () => this.removeSource( source.src ) }
										>{ __( 'Remove file' ) }</Button>
									</li>
								);
							} ) }
						</ul>
					</>
				) }
			</>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}

export default compose( [
	withNotices,
	withInstanceId,
] )( VideoEdit );
