<?php
/**
 * Server-side rendering of the `core/navigation-menu` block.
 *
 * @package gutenberg
 */

/**
 * Renders the `core/navigation-menu` block on server.
 *
 * @param array $attributes The block attributes.
 * @param array $content The saved content.
 * @param array $block The parsed block.
 *
 * @return string Returns the post content with the legacy widget added.
 */
function render_block_navigation_menu( $attributes, $content, $block ) {
	return '<nav class="wp-block-navigation-menu">' . build_navigation_menu_html( $block ) . '</nav>';
}

/**
 * Walks the inner block structure and returns an HTML list for it.
 *
 * @param array $block The block.
 *
 * @return string Returns  an HTML list from innerBlocks.
 */
function build_navigation_menu_html( $block ) {
	$html = '';
	foreach ( (array) $block['innerBlocks'] as $key => $menu_item ) {
		$html .= '<li class="wp-block-navigation-menu-item"><a class="wp-block-navigation-menu-item"';
		if ( isset( $menu_item['attrs']['destination'] ) ) {
			$html .= ' href="' . $menu_item['attrs']['destination'] . '"';
		}
		if ( isset( $menu_item['attrs']['title'] ) ) {
			$html .= ' title="' . $menu_item['attrs']['title'] . '"';
		}
		$html .= '>';
		if ( isset( $menu_item['attrs']['label'] ) ) {
			$html .= $menu_item['attrs']['label'];
		}
		$html .= '</a>';

		if ( count( (array) $menu_item['innerBlocks'] ) > 0 ) {
			$html .= build_navigation_menu_html( $menu_item );
		}

		$html .= '</li>';
	}
	return '<ul>' . $html . '</ul>';
}

/**
 * Register the navigation menu block.
 *
 * @uses render_block_navigation_menu()
 */
function register_block_core_navigation_menu() {
	$block_content = file_get_contents ( dirname( __FILE__ ) . '/../../../packages/block-library/src/navigation-menu/block.json' );
	if ( ! $block_content ) {
		throw new Error(
			'There is not a block.json file defined for the block!'
		);
	}
	$block_definition = json_decode( $block_content, true );
	if( is_null( $block_definition ) ) {
		throw new Error(
			'There is not possible to parse the block.json file!'
		);
	}

	// Pick up block name and remove it from the block-definition object.
	$block_name = $block_definition['name'];
	unset( $block_definition['name'] );

	// Add render callback into block-definition object.
	$block_definition['render_callback'] = 'render_block_navigation_menu';

	register_block_type(
		$block_name,
		$block_definition
	);
}

add_action( 'init', 'register_block_core_navigation_menu' );
