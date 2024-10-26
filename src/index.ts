export type Granularity = NonNullable<Intl.SegmenterOptions["granularity"]>;

const segmenterCachesByGranularity: Record<
	Granularity,
	Map<string, Intl.Segmenter>
> = {
	grapheme: new Map(),
	word: new Map(),
	sentence: new Map(),
};

type ArrayElementType<T> = T extends readonly (infer U)[] ? U : never;

/** Checks if the provided locales argument is an array. */
function isLocaleArray(
	locales: Intl.LocalesArgument,
): locales is ArrayElementType<Intl.LocalesArgument>[] {
	return Array.isArray(locales);
}

/** Normalizes the locale key for caching, using a dash-separated string format. */
function normalizeLocaleKey(locales: Intl.LocalesArgument | undefined): string {
	if (isLocaleArray(locales)) {
		return locales.map((locale) => locale.toString()).join("-");
	}
	return locales ? locales.toString() : "default";
}

/** Returns a cached segmenter instance based on locales and granularity or creates a new one if not cached. */
function getCachedSegmenter(
	locales: Intl.LocalesArgument | undefined,
	granularity: Granularity,
): Intl.Segmenter {
	const cache = segmenterCachesByGranularity[granularity];
	const cacheKey = normalizeLocaleKey(locales);
	let segmenter = cache.get(cacheKey);

	if (!segmenter) {
		segmenter = new Intl.Segmenter(locales, { granularity });
		cache.set(cacheKey, segmenter);
	}

	return segmenter;
}

/**
 * Returns the raw segments of a string based on the specified granularity and locale.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation: 'grapheme', 'word', or 'sentence'.
 * @param locales - Optional locales for segmentation.
 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
 */
export function getRawSegments(
	str: string,
	granularity: Granularity,
	locales: Intl.LocalesArgument = undefined,
): Intl.Segments {
	const segmenter = getCachedSegmenter(locales, granularity);
	return segmenter.segment(str);
}

/**
 * Filters and returns an iterable of raw word-like segment data.
 * Word-like segments are segments where `isWordLike` is true.
 * @param segments - The segments to filter.
 * @returns An iterable of `Intl.SegmentData` for each word-like segment.
 */
export function filterRawWordLikeSegments(
	segments: Intl.Segments,
): Iterable<Intl.SegmentData> {
	return (function* () {
		for (const segmentData of segments) {
			if (segmentData.isWordLike) {
				yield segmentData;
			}
		}
	})();
}

/**
 * Returns an iterable of raw word-like segments from the string.
 * Word-like segments are segments where `isWordLike` is true.
 * @param str - The string to segment.
 * @param locales - Optional locales for segmentation.
 * @returns An iterable of `Intl.SegmentData` for each word-like segment.
 */
export function getRawWordLikeSegments(
	str: string,
	locales: Intl.LocalesArgument = undefined,
): Iterable<Intl.SegmentData> {
	const segmenter = getCachedSegmenter(locales, "word");
	return filterRawWordLikeSegments(segmenter.segment(str));
}

/**
 * Segments a string based on specified granularity and locale.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation: 'grapheme', 'word', or 'sentence'.
 * @param locales - Optional locales for segmentation.
 */
export function getSegments(
	str: string,
	granularity: Granularity,
	locales: Intl.LocalesArgument = undefined,
): Iterable<string> {
	return (function* () {
		for (const segmentData of getRawSegments(str, granularity, locales)) {
			yield segmentData.segment;
		}
	})();
}

/**
 * Filters and returns an iterable of word-like segments.
 * Word-like segments are segments where `isWordLike` is true.
 * @param segments - The segments to filter.
 * @returns An iterable of strings for each word-like segment.
 */
export function filterWordLikeSegments(
	segments: Intl.Segments,
): Iterable<string> {
	return (function* () {
		for (const segmentData of segments) {
			if (segmentData.isWordLike) {
				yield segmentData.segment;
			}
		}
	})();
}

/**
 * Returns an iterable of word-like segments from the string.
 * Word-like segments are segments where `isWordLike` is true.
 * @param str - The string to segment.
 * @param locales - Optional locales for segmentation.
 * @returns An iterable of strings for each word-like segment.
 */
export function getWordLikeSegments(
	str: string,
	locales: Intl.LocalesArgument = undefined,
): Iterable<string> {
	const segmenter = getCachedSegmenter(locales, "word");
	return filterWordLikeSegments(segmenter.segment(str));
}

/**
 * Returns the number of segments in a string for the given granularity and locale.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation.
 * @param locales - Optional locales for segmentation.
 */
export function segmentCount(
	str: string,
	granularity: Granularity,
	locales: Intl.LocalesArgument = undefined,
): number {
	let count = 0;

	for (const _ of getSegments(str, granularity, locales)) {
		count++;
	}

	return count;
}

/**
 * Returns the raw segment data at a specific index in the string.
 * Supports negative indices (e.g., -1 for the last segment).
 * @param str - The string to segment.
 * @param index - Index of the desired segment (can be negative).
 * @param granularity - Level of segmentation.
 * @param locales - Optional locales for segmentation.
 * @returns The `Intl.SegmentData` at the specified index, or `undefined` if out of bounds.
 */
export function rawSegmentAt(
	str: string,
	index: number,
	granularity: Granularity,
	locales: Intl.LocalesArgument = undefined,
): Intl.SegmentData | undefined {
	const segments = getRawSegments(str, granularity, locales);

	if (index < 0) {
		return [...segments].at(index);
	}

	let currentIndex = 0;

	for (const segmentData of segments) {
		if (index === currentIndex) {
			return segmentData;
		}

		currentIndex++;
	}

	return undefined;
}

/**
 * Returns the segment at a specific index in the string.
 * @param str - The string to segment.
 * @param index - Index of the desired segment.
 * @param granularity - Level of segmentation.
 * @param locales - Optional locales for segmentation.
 */
export function segmentAt(
	str: string,
	index: number,
	granularity: Granularity,
	locales: Intl.LocalesArgument = undefined,
): string | undefined {
	const segments = getSegments(str, granularity, locales);

	if (index < 0) {
		return [...segments].at(index);
	}

	let currentIndex = 0;

	for (const segment of segments) {
		if (index === currentIndex) {
			return segment;
		}

		currentIndex++;
	}

	return undefined;
}

/** Provides segmentation utilities for strings with caching. */
export class SegmentString {
	constructor(
		private str: string,
		private locales: Intl.LocalesArgument = undefined,
	) {}

	/** Segments the string based on specified granularity and locale. */
	segments(
		granularity: Granularity,
		locales: Intl.LocalesArgument = this.locales,
	): Iterable<string> {
		return getSegments(this.str, granularity, locales);
	}

	rawSegments(
		granularity: Granularity,
		locales: Intl.LocalesArgument = this.locales,
	): Intl.Segments {
		return getRawSegments(this.str, granularity, locales);
	}

	/** Returns the count of segments based on granularity and locale. */
	segmentCount(
		granularity: Granularity,
		locales: Intl.LocalesArgument = this.locales,
	): number {
		return segmentCount(this.str, granularity, locales);
	}

	/** Returns the segment at a specified index for the given granularity and locale. */
	segmentAt(
		index: number,
		granularity: Granularity,
		locales: Intl.LocalesArgument = this.locales,
	): string | undefined {
		return segmentAt(this.str, index, granularity, locales);
	}

	toString(): string {
		return this.str;
	}
}

/** Provides grapheme segmentation utilities for strings. */
export class GraphemeString {
	private segmentString: SegmentString;
	private locales: Intl.LocalesArgument;

	constructor(str: string, locales?: Intl.LocalesArgument) {
		this.locales = locales;
		this.segmentString = new SegmentString(str, locales);
	}

	/** Returns an array of graphemes based on the locale. */
	graphemes(locales: Intl.LocalesArgument = this.locales): Iterable<string> {
		return this.segmentString.segments("grapheme", locales);
	}

	rawGraphemes(locales: Intl.LocalesArgument = this.locales): Intl.Segments {
		return this.segmentString.rawSegments("grapheme", locales);
	}

	/** Returns the count of graphemes for the specified locale. */
	graphemeCount(locales: Intl.LocalesArgument = this.locales): number {
		return this.segmentString.segmentCount("grapheme", locales);
	}

	/** Returns the grapheme at a specific index for the given locale. */
	graphemeAt(
		index: number,
		locales: Intl.LocalesArgument = this.locales,
	): string | undefined {
		return this.segmentString.segmentAt(index, "grapheme", locales);
	}

	[Symbol.iterator](): Iterator<string> {
		return this.graphemes()[Symbol.iterator]();
	}

	[Symbol.toPrimitive](hint: "string" | "number" | "default"): string | number {
		return hint === "string" || hint === "default" ? this.toString() : NaN;
	}

	toString(): string {
		return this.segmentString.toString();
	}
}

type WordsOptions = {
	isWordLike?: boolean;
};

/** Provides word segmentation utilities for strings. */
export class WordString {
	private segmentString: SegmentString;
	private locales: Intl.LocalesArgument;

	constructor(str: string, locales?: Intl.LocalesArgument) {
		this.locales = locales;
		this.segmentString = new SegmentString(str, locales);
	}

	/**
	 * Returns an iterable of raw word segments based on the specified locale, with an optional filter
	 * to include only "word-like" segments. Raw word segments include the detailed segment data provided
	 * by `Intl.Segmenter`, such as `isWordLike`, `index`, and `segment` properties.
	 *
	 * @param locales - The locale(s) to use for segmentation. Defaults to the instance's locale.
	 * @param options - Optional configuration for segmentation.
	 * @param options.isWordLike - If `true`, filters segments to include only "word-like" segments.
	 *                             "Word-like" segments are those marked by the `Intl.Segmenter` API
	 *                             as containing actual word content, excluding punctuation or whitespace.
	 * @returns An iterable of `Intl.SegmentData` objects, each representing detailed data for a word segment.
	 *
	 * @example
	 * const wordString = new WordString("Hello, world!");
	 * const rawSegments = [...wordString.rawWords(undefined, { isWordLike: true })];
	 * console.log(rawSegments.map(segment => segment.segment));
	 * // Output: ["Hello", "world"]
	 */
	rawWords(
		locales: Intl.LocalesArgument = this.locales,
		options: WordsOptions = {},
	): Iterable<Intl.SegmentData> {
		const segments = this.segmentString.rawSegments("word", locales);
		return options.isWordLike ? filterRawWordLikeSegments(segments) : segments;
	}

	/**
	 * Returns an iterable of word segments based on the specified locale, with an optional filter
	 * to include only "word-like" segments (segments identified as individual words).
	 *
	 * @param locales - The locale(s) to use for segmentation. Defaults to the instance's locale.
	 * @param options - Optional configuration for segmentation.
	 * @param options.isWordLike - If `true`, filters segments to include only "word-like" segments.
	 *                             "Word-like" segments are those marked by the `Intl.Segmenter` API
	 *                             as containing actual word content, excluding punctuation or whitespace.
	 * @returns An iterable of strings, each representing a word segment based on the locale.
	 *
	 * @example
	 * const wordString = new WordString("Hello, world!");
	 * console.log([...wordString.words(undefined, { isWordLike: true })]);
	 * // Output: ["Hello", "world"]
	 */
	words(
		locales: Intl.LocalesArgument = this.locales,
		options: WordsOptions = {},
	): Iterable<string> {
		const segments = this.rawWords(locales, options);
		return function* () {
			for (const segmentData of segments) {
				yield segmentData.segment;
			}
		}.call(this);
	}

	/** Returns the count of words for the specified locale. */
	wordCount(locales: Intl.LocalesArgument = this.locales): number {
		return this.segmentString.segmentCount("word", locales);
	}

	/** Returns the word at a specific index for the given locale. */
	wordAt(
		index: number,
		locales: Intl.LocalesArgument = this.locales,
	): string | undefined {
		return this.segmentString.segmentAt(index, "word", locales);
	}

	[Symbol.iterator](): Iterator<string> {
		return this.words()[Symbol.iterator]();
	}

	[Symbol.toPrimitive](hint: "string" | "number" | "default"): string | number {
		return hint === "string" || hint === "default" ? this.toString() : NaN;
	}

	toString(): string {
		return this.segmentString.toString();
	}
}

/** Provides sentence segmentation utilities for strings. */
export class SentenceString {
	private segmentString: SegmentString;
	private locales: Intl.LocalesArgument;

	constructor(str: string, locales?: Intl.LocalesArgument) {
		this.locales = locales;
		this.segmentString = new SegmentString(str, locales);
	}

	/** Returns an array of sentences based on the locale. */
	sentences(locales: Intl.LocalesArgument = this.locales): Iterable<string> {
		return this.segmentString.segments("sentence", locales);
	}

	rawSentences(locales: Intl.LocalesArgument = this.locales): Intl.Segments {
		return this.segmentString.rawSegments("sentence", locales);
	}

	/** Returns the count of sentences for the specified locale. */
	sentenceCount(locales: Intl.LocalesArgument = this.locales): number {
		return this.segmentString.segmentCount("sentence", locales);
	}

	/** Returns the sentence at a specific index for the given locale. */
	sentenceAt(
		index: number,
		locales: Intl.LocalesArgument = this.locales,
	): string | undefined {
		return this.segmentString.segmentAt(index, "sentence", locales);
	}

	[Symbol.iterator](): Iterator<string> {
		return this.sentences()[Symbol.iterator]();
	}

	[Symbol.toPrimitive](hint: "string" | "number" | "default"): string | number {
		return hint === "string" || hint === "default" ? this.toString() : NaN;
	}

	toString(): string {
		return this.segmentString.toString();
	}
}
