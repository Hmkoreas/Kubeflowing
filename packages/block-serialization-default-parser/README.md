# Block Serialization Default Parser

This library contains the default block serialization parser implementations for WordPress documents. It provides native PHP and JavaScript parsers that implement the [specification](/docs/contributors/grammar.md) from [`@wordpress/block-serialization-spec-parser`](/packages/block-serialization-spec-parser/README.md) and which normally operates on the document stored in `post_content`.

## Installation

Install the module

```bash
npm install @wordpress/block-serialization-default-parser --save
```

_This package assumes that your code will run in an **ES2015+** environment. If you're using an environment that has limited or no support for ES2015+ such as lower versions of IE then using [core-js](https://github.com/zloirock/core-js) or [@babel/polyfill](https://babeljs.io/docs/en/next/babel-polyfill) will add support for these methods. Learn more about it in [Babel docs](https://babeljs.io/docs/en/next/caveats)._

## Usage

Input post:
```html
<!-- wp:columns {"columns":3} -->
<div class="wp-block-columns has-3-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Left</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p><strong>Middle</strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->
```

Parsing code:
```js
import { parse } from '@wordpress/block-serialization-default-parser';

parse( post ) === [
    {
        blockName: "core/columns",
        attrs: {
            columns: 3
        },
        innerBlocks: [
            {
                blockName: "core/column",
                attrs: null,
                innerBlocks: [
                    {
                        blockName: "core/paragraph",
                        attrs: null,
                        innerBlocks: [],
                        innerHTML: "\n<p>Left</p>\n"
                    }
                ],
                innerHTML: '\n<div class="wp-block-column"></div>\n'
            },
            {
                blockName: "core/column",
                attrs: null,
                innerBlocks: [
                    {
                        blockName: "core/paragraph",
                        attrs: null,
                        innerBlocks: [],
                        innerHTML: "\n<p><strong>Middle</strong></p>\n"
                    }
                ],
                innerHTML: '\n<div class="wp-block-column"></div>\n'
            },
            {
                blockName: "core/column",
                attrs: null,
                innerBlocks: [],
                innerHTML: '\n<div class="wp-block-column"></div>\n'
            }
        ],
        innerHTML: '\n<div class="wp-block-columns has-3-columns">\n\n\n\n</div>\n'
    }
];
```

## Theory

### What is different about this one from the spec-parser?

This is a recursive-descent parser that scans linearly once through the input document. Instead of directly recursing it utilizes a trampoline mechanism to prevent stack overflow. It minimizes data copying and passing through the use of globals for tracking state through the parse. Between every token (a block comment delimiter) we can instrument the parser and intervene should we want to; for example we might put a hard limit on how long we can be parsing a document or provide additional debugging diagnostics for a document.

The spec parser is defined via a _Parsing Expression Grammar_ (PEG) which answers many questions inherently that we must answer explicitly in this parser. The goal for this implementation is to match the characteristics of the PEG so that it can be directly swapped out and so that the only changes are better runtime performance and memory usage.

### How does it work?

Every serialized Gutenberg document is nominally an HTML document which, in addition to normal HTML, may also contain specially designed HTML comments -- the block comment delimiters -- which separate and isolate the blocks serialized in the document.

This parser attempts to create a state-machine around the transitions triggered from those delimiters -- the "tokens" of the grammar. Every time we find one we should only be doing either of:

 - enter a new block;
 - exit out of a block.

Those actions have different effects depending on the context; for instance, when we exit a block we either need to add it to the output block list _or_ we need to append it as the next `innerBlock` on the parent block below it in the block stack (the place where we track open blocks). The details are documented below.

The biggest challenge in this parser is making the right accounting of indices required to construct the `innerHTML` values for each block at every level of nesting depth. We take a simple approach:

 - Start each newly opened block with an empty `innerHTML`.
 - Whenever we push a first block into the `innerBlocks` list, add the content from where the content of the parent block started to where this inner block starts.
 - Whenever we push another block into the `innerBlocks` list, add the content from where the previous inner block ended to where this inner block starts.
 - When we close out an open block, add the content from where the last inner block ended to where the closing block delimiter starts.
 - If there are no inner blocks then we take the entire content between the opening and closing block comment delimiters as the `innerHTML`.

### I meant, how does it perform?

This parser operates much faster than the generated parser from the specification. Because we know more about the parsing than the PEG does we can take advantage of several tricks to improve our speed and memory usage:

 - We only have one or two distinct tokens, depending on how you look at it, and they are all readily matched via a regular expression. Instead of parsing on a character-per-character basis we can allow the PCRE RegExp engine to skip over large swaths of the document for us in order to find those tokens.
 - Since `preg_match()` takes an `offset` parameter we can crawl through the input without passing copies of the input text on every step. We can track our position in the string and only pass a number instead.
 - Not copying all those strings means that we'll also skip many memory allocations.

Further, tokenizing with a RegExp brings an additional advantage. The parser generated by the PEG provides predictable performance characteristics in exchange for control over tokenization rules -- it doesn't allow us to define RegExp patterns in the rules so as to guard against _e.g._ cataclysmic backtracking that would break the PEG guarantees.

However, since our "token language" of the block comment delimiters is _regular_ and _can_ be trivially matched with RegExp patterns, we can do that here and then something magical happens: we jump out of PHP or JavaScript and into a highly-optimized RegExp engine written in C or C++ on the host system. We thereby leave the virtual machine and its overhead.

<br/><br/><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>