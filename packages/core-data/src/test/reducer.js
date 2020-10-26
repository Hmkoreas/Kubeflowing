/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';
import { filter } from 'lodash';

/**
 * Internal dependencies
 */
import { terms, entities, embedPreviews, userPermissions, autosaves, currentUser } from '../reducer';

describe( 'terms()', () => {
	it( 'returns an empty object by default', () => {
		const state = terms( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	it( 'returns with received terms', () => {
		const originalState = deepFreeze( {} );
		const state = terms( originalState, {
			type: 'RECEIVE_TERMS',
			taxonomy: 'categories',
			terms: [ { id: 1 } ],
		} );

		expect( state ).toEqual( {
			categories: [ { id: 1 } ],
		} );
	} );
} );

describe( 'entities', () => {
	it( 'returns the default state for all defined entities', () => {
		const state = entities( undefined, {} );

		expect( state.data.root.postType ).toEqual( { items: {}, queries: {} } );
	} );

	it( 'returns with received post types by slug', () => {
		const originalState = deepFreeze( {} );
		const state = entities( originalState, {
			type: 'RECEIVE_ITEMS',
			items: [ { slug: 'b', title: 'beach' }, { slug: 's', title: 'sun' } ],
			kind: 'root',
			name: 'postType',
		} );

		expect( state.data.root.postType ).toEqual( {
			items: {
				b: { slug: 'b', title: 'beach' },
				s: { slug: 's', title: 'sun' },
			},
			queries: {},
		} );
	} );

	it( 'appends the received post types by slug', () => {
		const originalState = deepFreeze( {
			data: {
				root: {
					postType: {
						items: {
							w: { slug: 'w', title: 'water' },
						},
						queries: {},
					},
				},
			},
		} );
		const state = entities( originalState, {
			type: 'RECEIVE_ITEMS',
			items: [ { slug: 'b', title: 'beach' } ],
			kind: 'root',
			name: 'postType',
		} );

		expect( state.data.root.postType ).toEqual( {
			items: {
				w: { slug: 'w', title: 'water' },
				b: { slug: 'b', title: 'beach' },
			},
			queries: {},
		} );
	} );

	it( 'returns with updated entities config', () => {
		const originalState = deepFreeze( {} );
		const state = entities( originalState, {
			type: 'ADD_ENTITIES',
			entities: [ { kind: 'postType', name: 'posts' } ],
		} );

		expect( filter( state.config, { kind: 'postType' } ) ).toEqual( [
			{ kind: 'postType', name: 'posts' },
		] );
	} );
} );

describe( 'embedPreviews()', () => {
	it( 'returns an empty object by default', () => {
		const state = embedPreviews( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	it( 'returns with received preview', () => {
		const originalState = deepFreeze( {} );
		const state = embedPreviews( originalState, {
			type: 'RECEIVE_EMBED_PREVIEW',
			url: 'http://twitter.com/notnownikki',
			preview: { data: 42 },
		} );

		expect( state ).toEqual( {
			'http://twitter.com/notnownikki': { data: 42 },
		} );
	} );
} );

describe( 'userPermissions()', () => {
	it( 'defaults to an empty object', () => {
		const state = userPermissions( undefined, {} );
		expect( state ).toEqual( {} );
	} );

	it( 'updates state with whether an action is allowed', () => {
		const original = deepFreeze( {
			'create/media': false,
		} );

		const state = userPermissions( original, {
			type: 'RECEIVE_USER_PERMISSION',
			key: 'create/media',
			isAllowed: true,
		} );

		expect( state ).toEqual( {
			'create/media': true,
		} );
	} );
} );

describe( 'autosaves', () => {
	it( 'returns an empty object by default', () => {
		const state = autosaves( undefined, {} );

		expect( state ).toEqual( {} );
	} );

	it( 'returns the current state with the new autosaves merged in, keyed by the parent post id', () => {
		const existingAutosaves = [ {
			title: {
				raw: 'Some',
			},
			content: {
				raw: 'other',
			},
			excerpt: {
				raw: 'autosave',
			},
			status: 'publish',
		} ];

		const newAutosaves = [ {
			title: {
				raw: 'The Title',
			},
			content: {
				raw: 'The Content',
			},
			excerpt: {
				raw: 'The Excerpt',
			},
			status: 'draft',
		} ];

		const state = autosaves( { 1: existingAutosaves }, {
			type: 'RECEIVE_AUTOSAVES',
			postId: 2,
			autosaves: newAutosaves,
		} );

		expect( state ).toEqual( {
			1: existingAutosaves,
			2: newAutosaves,
		} );
	} );

	it( 'overwrites any existing state if new autosaves are received with the same post id', () => {
		const existingAutosaves = [ {
			title: {
				raw: 'Some',
			},
			content: {
				raw: 'other',
			},
			excerpt: {
				raw: 'autosave',
			},
			status: 'publish',
		} ];

		const newAutosaves = [ {
			title: {
				raw: 'The Title',
			},
			content: {
				raw: 'The Content',
			},
			excerpt: {
				raw: 'The Excerpt',
			},
			status: 'draft',
		} ];

		const state = autosaves( { 1: existingAutosaves }, {
			type: 'RECEIVE_AUTOSAVES',
			postId: 1,
			autosaves: newAutosaves,
		} );

		expect( state ).toEqual( {
			1: newAutosaves,
		} );
	} );
} );

describe( 'currentUser', () => {
	it( 'returns an empty object by default', () => {
		const state = currentUser( undefined, {} );
		expect( state ).toEqual( {} );
	} );

	it( 'returns the current user', () => {
		const currentUserData = { id: 1 };

		const state = currentUser( {}, {
			type: 'RECEIVE_CURRENT_USER',
			currentUser: currentUserData,
		} );

		expect( state ).toEqual( currentUserData );
	} );

	it( 'overwrites any existing current user state', () => {
		const currentUserData = { id: 2 };

		const state = currentUser( { id: 1 }, {
			type: 'RECEIVE_CURRENT_USER',
			currentUser: currentUserData,
		} );

		expect( state ).toEqual( currentUserData );
	} );
} );
