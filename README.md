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

````

## Getting Started

This library wraps the native `Intl.Segmenter` API, providing a more developer-friendly interface for manipulating strings with granular and locale-aware segments. It’s especially useful for applications needing precise control over segments, such as language-processing tools, UI frameworks, and more.

```typescript
import { SegmentString } from "segment-string";

const str = new SegmentString("Hello, world! こんにちは世界！");

// Segment by grapheme
console.log([...str.graphemes()]); // ['H', 'e', 'l', 'l', 'o', ',', ' ', 'w', 'o', 'r', 'l', 'd', '!', ' ', 'こ', 'ん', 'に', 'ち', 'は', '世', '界', '！']
```

## API Documentation

### 1. `getRawSegments`

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

### 2. `getSegments`

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

### 3. `segmentCount`

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

### 4. `segmentAt`

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

#### Example Usage

```typescript
import { SegmentString } from "segment-string";

const text = new SegmentString("Hello, world! こんにちは世界！");

// Segmenting by words
for (const word of text.words()) {
	console.log(word); // 'Hello', ',', ' ', 'world', '!', ' こんにちは世界！'
}

// Segmenting graphemes and counting
const graphemeCount = text.graphemeCount();
console.log(graphemeCount); // 23

// Accessing a specific word
const secondWord = text.wordAt(1); // 'world'
console.log(secondWord);
```

---

## Benefits Over Direct `Intl.Segmenter` Usage

Using `segment-string` provides significant benefits over directly working with `Intl.Segmenter`:

- **Simple API**: Simplifies `Intl.Segmenter` usage with an easy-to-use API for segmentation, counting, and retrieval at specific indices.
- **Efficient Caching**: Automatically caches segmenters by locale and granularity, improving performance and avoiding unnecessary re-creation.
- **Advanced Options**: Provides options such as `isWordLike` for word segments, not natively available in `Intl.Segmenter`.
- **Locale-Aware**: Enables locale overrides per operation, allowing for flexible, multilingual segmentation.

---

## Contributors

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Not-Jayden"><img src="https://avatars.githubusercontent.com/u/16816250?v=4?s=100" width="100px;" alt="Jayden Carey"/><br /><sub><b>Jayden Carey</b></sub></a><br /><a href="https://github.com/Not-Jayden/segment-string/commits?author=Not-Jayden" title="Code">💻</a> <a href="#content-Not-Jayden" title="Content">🖋</a> <a href="https://github.com/Not-Jayden/segment-string/commits?author=Not-Jayden" title="Documentation">📖</a> <a href="#ideas-Not-Jayden" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Not-Jayden" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Not-Jayden" title="Maintenance">🚧</a> <a href="#projectManagement-Not-Jayden" title="Project Management">📆</a> <a href="#tool-Not-Jayden" title

="Tools">🔧</a></td>
<td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
</tr>

  </tbody>
</table>

---

> 💙 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app).
````
