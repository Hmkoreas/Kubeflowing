/**
 * Internal dependencies
 */
import ActionBar from '../';
import ActionBarBlock from '../block';
import ActionBarDivider from '../divider';
import ActionBarItem from '../item';
import Dropdown from '../../dropdown';
import Flex from '../../flex';
import IconButton from '../../icon-button';
import MenuGroup from '../../menu-group';
import MenuItem from '../../menu-item';
import Tooltip from '../../tooltip';

import './style.css';

export default { title: 'Components|ActionBar', component: ActionBar };

const DropdownActions = () => {
	return (
		<div className="additional-actions">
			<Dropdown
				className="my-container-class-name"
				contentClassName="my-popover-content-classname"
				position="bottom right"
				renderToggle={ ( { isOpen, onToggle } ) => (
					<IconButton
						icon="ellipsis"
						isTertiary
						onClick={ onToggle }
						aria-expanded={ isOpen }
					/>
				) }
				renderContent={ () => (
					<MenuGroup>
						<MenuItem icon="star-filled">Favorite</MenuItem>
						<MenuItem icon="share-alt2">Share</MenuItem>
						<MenuItem icon="admin-generic">Settings</MenuItem>
					</MenuGroup>
				) }
			/>
		</div>
	);
};

export const _default = () => {
	return (
		<ActionBar>
			<ActionBarItem>
				<IconButton icon="insert" isTertiary />
			</ActionBarItem>
			<ActionBarBlock />
			<ActionBarItem>
				<DropdownActions />
			</ActionBarItem>
		</ActionBar>
	);
};

export const backAndTitle = () => {
	return (
		<ActionBar>
			<ActionBarItem>
				<IconButton icon="arrow-left-alt" isTertiary />
			</ActionBarItem>
			<ActionBarItem>
				<h3 style={ { margin: 0 } }>Title</h3>
			</ActionBarItem>
			<ActionBarBlock />
			<ActionBarItem>
				<DropdownActions />
			</ActionBarItem>
		</ActionBar>
	);
};

export const gutenbergTopBar = () => {
	return (
		<ActionBar className="action-bar-story-example" innerPadding="small">
			<ActionBarItem>
				<IconButton icon="arrow-left-alt2" />
			</ActionBarItem>
			<ActionBarDivider />
			<ActionBarItem>
				<Flex justify="left" gap="extraSmall">
					<Tooltip text="Add block">
						<IconButton icon="insert" />
					</Tooltip>
					<Tooltip text="Undo">
						<IconButton icon="undo" />
					</Tooltip>
					<Tooltip text="Redo">
						<IconButton icon="redo" />
					</Tooltip>
					<Tooltip text="Content structure">
						<IconButton icon="info" />
					</Tooltip>
					<Tooltip text="Block navigation">
						<IconButton icon="menu" />
					</Tooltip>
				</Flex>
			</ActionBarItem>
			<ActionBarBlock />
			<ActionBarItem>
				<Flex justify="left" gap="extraSmall">
					<Tooltip text="Settings">
						<IconButton icon="admin-generic" />
					</Tooltip>
					<Tooltip text="More tools & options">
						<IconButton icon="ellipsis" />
					</Tooltip>
				</Flex>
			</ActionBarItem>
		</ActionBar>
	);
};

/**
 * EXPERIMENT:
 * Creating a Toolbar component using ActionBar
 */
const Toolbar = ( props ) => {
	return (
		<ActionBar
			{ ...props }
			className="action-bar-story-example toolbar"
			dividerSpacing="none"
			innerPadding="extraSmall"
			justify="left"
		/>
	);
};
const ToolbarItem = ActionBarItem;

export const experimentToolbar = () => {
	return (
		<Toolbar>
			<ToolbarItem>
				<IconButton icon="insert" />
			</ToolbarItem>
			<ToolbarItem>
				<Flex justify="left" gap="extraSmall">
					<IconButton icon="undo" />
					<IconButton icon="redo" />
				</Flex>
			</ToolbarItem>
			<ToolbarItem>
				<Flex justify="left" gap="extraSmall">
					<IconButton icon="info" />
					<IconButton icon="menu" />
				</Flex>
			</ToolbarItem>
		</Toolbar>
	);
};
