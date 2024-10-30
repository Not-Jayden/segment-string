<h1 align="center">🧩 segment-string</h1>

<p align="center">A lightweight, intuitive wrapper around Intl.Segmenter for seamless segment-aware string operations in TypeScript and JavaScript.</p>

<p align="center">
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 2" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-2-21bb42.svg" /></a>
	<a href="https://github.com/Not-Jayden/segment-string/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/Not-Jayden/segment-string" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/Not-Jayden/segment-string?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/Not-Jayden/segment-string/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/segment-string"><img alt="📦 npm version" src="https://img.shields.io/npm/v/segment-string?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

---

## Key Features

- **Intuitive [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) Wrapper**: Simplifies text segmentation with a clean API.
- **Standards-Based**: Built on native `Intl.Segmenter` for robust compatibility.
- **Lightweight & Tree-Shakeable**: Minimal footprint with optimal bundling (836B minified + gzipped).
- **Highly Performant**: Uses iterators for efficient, on-demand processing.
- **Full TypeScript Support**: Strict types for safe, predictable usage.

---

## Installation

```shell
npm install segment-string
```

## Getting Started

`segment-string` is a lightweight wrapper for `Intl.Segmenter`, designed to simplify locale-sensitive text segmentation in JavaScript and TypeScript. It lets you easily segment and manipulate text by graphemes, words, or sentences, ideal for handling complex cases like multi-character emojis or language-specific boundaries.

```typescript
import { SegmentString } from "segment-string";

const str = new SegmentString("Hello, world! 👩‍👩‍👧‍👦🌍🌈");

// Segment by grapheme
console.log([...str.graphemes()]); // ['H', 'e', 'l', 'l', 'o', ',', ' ', 'w', 'o', 'r', 'l', 'd', '!', ' ', '👩‍👩‍👧‍👦', '🌍', '🌈']
```

---

## SegmentString Class

The `SegmentString` class encapsulates a string and provides methods for segmentation, counting, and retrieving segments at specified indices with locale and granularity options.

### Constructor

```typescript
new SegmentString(str: string, locales?: Intl.LocalesArgument);
```

- **str**: The string to segment.
- **locales**: Optional locales argument for segmentation.

### Methods

#### `segments(granularity: Granularity, options?: SegmentationOptions | WordSegmentationOptions): Iterable<string>`

Segments the string by the specified granularity and returns the segments as strings.

#### `rawSegments(granularity: Granularity, options?: SegmentationOptions | WordSegmentationOptions): Intl.Segments | Iterable<Intl.SegmentData>`

Returns raw `Intl.SegmentData` objects based on granularity and options.

#### `segmentCount(granularity: Granularity, options?: SegmentationOptions | WordSegmentationOptions): number`

Counts segments in the string based on the specified granularity.

#### `segmentAt(index: number, granularity: Granularity, options?: SegmentationOptions | WordSegmentationOptions): string | undefined`

Retrieves the segment at a specific index, supporting negative indices.

#### `rawSegmentAt(index: number, granularity: Granularity, options?: SegmentationOptions | WordSegmentationOptions): Intl.SegmentData | undefined`

Returns the raw segment data at a specific index, supporting negative indices.

#### `graphemes(options?: SegmentationOptions): Iterable<string>`

Returns an iterable of grapheme segments as strings.

#### `rawGraphemes(options?: SegmentationOptions): Iterable<Intl.SegmentData>`

Returns an iterable of raw grapheme segments.

#### `graphemeCount(options?: SegmentationOptions): number`

Counts grapheme segments in the string.

#### `graphemeAt(index: number, options?: SegmentationOptions): string | undefined`

Returns the grapheme at a specific index, supporting negative indices.

#### `rawGraphemeAt(index: number, options?: SegmentationOptions): Intl.SegmentData | undefined`

Returns the raw grapheme data at a specific index, supporting negative indices.

#### `words(options?: WordSegmentationOptions): Iterable<string>`

Returns an iterable of word segments, with optional filtering for word-like segments.

#### `rawWords(options?: WordSegmentationOptions): Iterable<Intl.SegmentData>`

Returns an iterable of raw word segments, with optional filtering for word-like segments.

#### `wordCount(options?: WordSegmentationOptions): number`

Counts word segments in the string.

#### `wordAt(index: number, options?: WordSegmentationOptions): string | undefined`

Returns the word at a specific index, supporting negative indices.

#### `rawWordAt(index: number, options?: WordSegmentationOptions): Intl.SegmentData | undefined`

Returns the raw word data at a specific index, supporting negative indices.

#### `sentences(options?: SegmentationOptions): Iterable<string>`

Returns an iterable of sentence segments.

#### `rawSentences(options?: SegmentationOptions): Iterable<Intl.SegmentData>`

Returns an iterable of raw sentence segments.

#### `sentenceCount(options?: SegmentationOptions): number`

Counts sentence segments in the string.

#### `sentenceAt(index: number, options?: SegmentationOptions): string | undefined`

Returns the sentence at a specific index, supporting negative indices.

#### `rawSentenceAt(index: number, options?: SegmentationOptions): Intl.SegmentData | undefined`

Returns the raw sentence data at a specific index, supporting negative indices.

#### `[Symbol.iterator](): Iterator<string>`

Returns an iterator over the graphemes of the string.

---

## Example Usage

```typescript
import { SegmentString } from "segment-string";

const text = new SegmentString("Hello, world! 👩‍👩‍👧‍👦🌍🌈");

// Segmenting by words
for (const word of text.words()) {
	console.log(word); // 'Hello', ',', ' ', 'world', '!', ' 👩‍👩‍👧‍👦🌍🌈'
}

// Segmenting graphemes and counting
console.log([...text.graphemes()]); // ['H', 'e', 'l', 'l', 'o', ',', ' ', 'w', 'o', 'r', 'l', 'd', '!', ' ', '👩‍👩‍👧‍👦', '🌍', '🌈']
console.log("Grapheme count:", text.graphemeCount()); // 17
console.log("String length:", text.toString().length); // 29

// Accessing a specific word
const secondWord = text.wordAt(1, { isWordLike: true }); // 'world'
console.log(secondWord);
```

---

## SegmentSplitter Class

Alternatively, the `SegmentSplitter` class allows you to create an instance that can be directly used with JavaScript's `String.prototype.split` method for basic segmentation.

### Constructor

```typescript
new SegmentSplitter<T extends Granularity>(granularity: T, options?: SegmentationOptions<T>);
```

- **granularity**: Specifies the segmentation granularity level (`'grapheme'`, `'word'`, `'sentence'`, etc.).
- **options**: Optional settings to customize the segmentation for the given granularity.

## Example Usage

```typescript
const str = "Hello, world!";
const wordSplitter = new SegmentSplitter("word", { isWordLike: true });
const words = str.split(wordSplitter);
console.log(words); // ["Hello", "world"]
```

---

## Individual Functions

### `getRawSegments`

```typescript
function getRawSegments(
	str: string,
	granularity: Granularity,
	options?: SegmentationOptions | WordSegmentationOptions,
): Intl.Segments | Iterable<Intl.SegmentData>;
```

- **Description**: Returns raw `Intl.SegmentData` objects based on granularity and options.
- **Parameters**:
  - `str`: The string to segment.
  - `granularity`: Specifies the segmentation level (`'grapheme'`, `'word'`, or `'sentence'`).
  - `options`: Includes `locales` for specifying locale and `isWordLike` for filtering word-like segments.
- **Returns**: An iterable of raw `Intl.SegmentData`.

### `getSegments`

```typescript
function getSegments(
	str: string,
	granularity: Granularity,
	options?: SegmentationOptions | WordSegmentationOptions,
): Iterable<string>;
```

- **Description**: Returns segments of the string as plain strings.
- **Parameters**: Similar to `getRawSegments`.
- **Returns**: An iterable of segments as strings.

### `segmentCount`

```typescript
function segmentCount(
	str: string,
	granularity: Granularity,
	options?: SegmentationOptions | WordSegmentationOptions,
): number;
```

- **Description**: Returns the count of segments based on granularity and options.
- **Parameters**: Similar to `getRawSegments`.
- **Returns**: Number of segments.

### `rawSegmentAt`

```typescript
function rawSegmentAt(
	str: string,
	index: number,
	granularity: Granularity,
	options?: SegmentationOptions | WordSegmentationOptions,
): Intl.SegmentData | undefined;
```

- **Description**: Returns the raw segment data at a specified index, supporting negative indices.
- **Parameters**: Similar to `getRawSegments`, plus an `index` parameter.
- **Returns**: The `Intl.SegmentData` at the specified index, or `undefined` if out of bounds.

### `segmentAt`

```typescript
function segmentAt(
	str: string,
	index: number,
	granularity: Granularity,
	options?: SegmentationOptions | WordSegmentationOptions,
): string | undefined;
```

- **Description**: Returns the segment at a specified index, supporting negative indices.
- **Parameters**: Similar to `getRawSegments`, plus an `index` parameter.
- **Returns**: The segment at the specified index or `undefined` if out of bounds.

### `filterRawWordLikeSegments`

```typescript
function filterRawWordLikeSegments(
	segments: Intl.Segments,
): Iterable<Intl.SegmentData>;
```

- **Description**: Filters and returns an iterable of raw word-like segment data where `isWordLike` is true.
- **Parameters**:
  - `segments`: The segments to filter.
- **Returns**: An iterable of `Intl.SegmentData` for each word-like segment.

### `filterWordLikeSegments`

```typescript
function filterWordLikeSegments(segments: Intl.Segments): Iterable<string>;
```

- **Description**: Filters and returns an iterable of word-like segments as strings where `isWordLike` is true.
- **Parameters**:
  - `segments`: The segments to filter.
- **Returns**: An iterable of strings for each word-like segment.

---

> 💙 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app).
