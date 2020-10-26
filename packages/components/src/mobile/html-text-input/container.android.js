/**
 * External dependencies
 */
import { WPScrollView } from 'react-native-aztec';

/**
 * Internal dependencies
 */
import KeyboardAvoidingView from '../keyboard-avoiding-view';
import styles from './style.android.scss';

const HTMLInputContainer = ( { children, parentHeight } ) => (
	<KeyboardAvoidingView style={ styles.keyboardAvoidingView } parentHeight={ parentHeight }>
		<WPScrollView style={ styles.scrollView } >
			{ children }
		</WPScrollView>
	</KeyboardAvoidingView>
);

HTMLInputContainer.scrollEnabled = false;

export default HTMLInputContainer;
