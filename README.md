<h1 align="center">segment-string</h1>

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

- **Intuitive `Intl.Segmenter` Wrapper**: Simplifies text segmentation with a clean API.
- **Standards-Based**: Built on native `Intl.Segmenter` for robust compatibility.
- **Lightweight & Tree-Shakeable**: Minimal footprint with optimal bundling.
- **Highly Performant**: Uses iterators for efficient, on-demand processing.
- **Full TypeScript Support**: Strict types for safe, predictable usage.

---

## Installation

```shell
npm install segment-string
```

## Getting Started

This library wraps the native `Intl.Segmenter` API, providing a more developer-friendly interface for manipulating strings with granular and locale-aware segments. It’s especially useful for applications needing precise control over segments, such as language-processing tools, UI frameworks, and more.

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

#### `graphemes(options?: SegmentationOptions): Iterable<string>`

Returns an iterable of grapheme segments as strings.

#### `words(options?: WordSegmentationOptions): Iterable<string>`

Returns an iterable of word segments, with optional filtering for word-like segments.

#### `sentences(options?: SegmentationOptions): Iterable<string>`

Returns an iterable of sentence segments.

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
console.log("String length:", text.toString().length); // 26

// Accessing a specific word
const secondWord = text.wordAt(1); // 'world'
console.log(secondWord);
```

The above example demonstrates how `graphemeCount` counts visual units (graphemes), which differ from the raw `string.length` due to multi-codepoint emoji.

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
  - `options`: Includes `localesOverride` for specifying locale and `isWordLike` for filtering word-like segments.
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
