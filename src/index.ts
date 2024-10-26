/**
 * Specifies the level of segmentation for string processing.
 * Can be 'grapheme', 'word', or 'sentence'.
 */
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

/** Options for segmentation methods. */
type SegmentationOptions = {
	/** Optional locales to override the default locale for segmentation. */
	localesOverride?: Intl.LocalesArgument;
};

/** Options specific to word segmentation methods. */
type WordSegmentationOptions = SegmentationOptions & {
	/** If true, filters segments to include only "word-like" segments. */
	isWordLike?: boolean;
};

/**
 * Returns the raw segments of a string based on the specified granularity and options.
 * Supports additional options for 'word' granularity.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation ('word').
 * @param options - Options for word segmentation.
 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
 */
export function getRawSegments(
	str: string,
	granularity: "word",
	options?: WordSegmentationOptions,
): Iterable<Intl.SegmentData>;

/**
 * Returns the raw segments of a string based on the specified granularity and options.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
 * @param options - Options for segmentation.
 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
 */
export function getRawSegments(
	str: string,
	granularity: Exclude<Granularity, "word">,
	options?: SegmentationOptions,
): Intl.Segments;

/**
 * Returns the raw segments of a string based on the specified granularity and options.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation.
 * @param options - Options for segmentation.
 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
 */
export function getRawSegments(
	str: string,
	granularity: Granularity,
	options: SegmentationOptions | WordSegmentationOptions = {},
): Intl.Segments | Iterable<Intl.SegmentData> {
	const locales = options.localesOverride;
	const segmenter = getCachedSegmenter(locales, granularity);
	const segments = segmenter.segment(str);

	if (
		granularity === "word" &&
		(options as WordSegmentationOptions).isWordLike
	) {
		return filterRawWordLikeSegments(segments);
	} else {
		return segments;
	}
}

/**
 * Segments a string based on specified granularity and options.
 * Supports additional options for 'word' granularity.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation ('word').
 * @param options - Options for word segmentation.
 * @returns An iterable of segments as strings.
 */
export function getSegments(
	str: string,
	granularity: "word",
	options?: WordSegmentationOptions,
): Iterable<string>;

/**
 * Segments a string based on specified granularity and options.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
 * @param options - Options for segmentation.
 * @returns An iterable of segments as strings.
 */
export function getSegments(
	str: string,
	granularity: Exclude<Granularity, "word">,
	options?: SegmentationOptions,
): Iterable<string>;

/**
 * Segments a string based on specified granularity and options.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation.
 * @param options - Options for segmentation.
 * @returns An iterable of segments as strings.
 */
export function getSegments(
	str: string,
	granularity: Granularity,
	options: SegmentationOptions | WordSegmentationOptions = {},
): Iterable<string> {
	const segments = getRawSegments(str, granularity, options);

	return (function* () {
		for (const segmentData of segments) {
			yield segmentData.segment;
		}
	})();
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
 * Returns the number of segments in a string for the given granularity and options.
 * Supports additional options for 'word' granularity.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation ('word').
 * @param options - Options for word segmentation.
 * @returns The number of segments.
 */
export function segmentCount(
	str: string,
	granularity: "word",
	options: WordSegmentationOptions,
): number;

/**
 * Returns the number of segments in a string for the given granularity and options.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
 * @param options - Options for segmentation.
 * @returns The number of segments.
 */
export function segmentCount(
	str: string,
	granularity: Exclude<Granularity, "word">,
	options?: SegmentationOptions,
): number;

/**
 * Returns the number of segments in a string for the given granularity and options.
 * @param str - The string to segment.
 * @param granularity - Level of segmentation.
 * @param options - Options for segmentation.
 * @returns The number of segments.
 */
export function segmentCount(
	str: string,
	granularity: Granularity,
	options: SegmentationOptions | WordSegmentationOptions = {},
): number {
	let count = 0;

	for (const _ of getSegments(str, granularity, options)) {
		count++;
	}

	return count;
}

/**
 * Returns the segment at a specific index in the string.
 * Supports negative indices (e.g., -1 for the last segment).
 * Supports additional options for 'word' granularity.
 * @param str - The string to segment.
 * @param index - Index of the desired segment (can be negative).
 * @param granularity - Level of segmentation ('word').
 * @param options - Options for word segmentation.
 * @returns The segment at the specified index, or `undefined` if out of bounds.
 */
export function segmentAt(
	str: string,
	index: number,
	granularity: "word",
	options: WordSegmentationOptions,
): string | undefined;

/**
 * Returns the segment at a specific index in the string.
 * Supports negative indices (e.g., -1 for the last segment).
 * @param str - The string to segment.
 * @param index - Index of the desired segment (can be negative).
 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
 * @param options - Options for segmentation.
 * @returns The segment at the specified index, or `undefined` if out of bounds.
 */
export function segmentAt(
	str: string,
	index: number,
	granularity: Exclude<Granularity, "word">,
	options?: SegmentationOptions,
): string | undefined;

/**
 * Returns the segment at a specific index in the string.
 * Supports negative indices (e.g., -1 for the last segment).
 * @param str - The string to segment.
 * @param index - Index of the desired segment (can be negative).
 * @param granularity - Level of segmentation.
 * @param options - Options for segmentation.
 * @returns The segment at the specified index, or `undefined` if out of bounds.
 */
export function segmentAt(
	str: string,
	index: number,
	granularity: Granularity,
	options: SegmentationOptions | WordSegmentationOptions = {},
): string | undefined {
	const segments = getSegments(str, granularity, options);

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

/**
 * A class representing a segmentable string, providing methods to segment it into graphemes, words, or sentences.
 */
export class SegmentString {
	/**
	 * Creates a new SegmentString instance.
	 * @param str - The string to be segmented.
	 * @param locales - Optional locales argument for segmentation.
	 */
	constructor(
		private str: string,
		private locales: Intl.LocalesArgument = undefined,
	) {}

	/**
	 * Segments the string based on specified granularity and options.
	 * Supports additional options for 'word' granularity.
	 * @param granularity - Level of segmentation ('word').
	 * @param options - Options for word segmentation.
	 * @returns An iterable of segments as strings.
	 */
	segments(
		granularity: "word",
		options: WordSegmentationOptions,
	): Iterable<string>;

	/**
	 * Segments the string based on specified granularity and options.
	 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
	 * @param options - Options for segmentation.
	 * @returns An iterable of segments as strings.
	 */
	segments(
		granularity: Exclude<Granularity, "word">,
		options?: SegmentationOptions,
	): Iterable<string>;

	/**
	 * Segments the string based on specified granularity and options.
	 * @param granularity - Level of segmentation.
	 * @param options - Options for segmentation.
	 * @returns An iterable of segments as strings.
	 */
	segments(
		granularity: Granularity,
		options: SegmentationOptions | WordSegmentationOptions = {},
	): Iterable<string> {
		const { localesOverride = this.locales } = options;
		return getSegments(this.str, granularity, { ...options, localesOverride });
	}

	/**
	 * Returns raw segments of the string based on the specified granularity and options.
	 * Supports additional options for 'word' granularity.
	 * @param granularity - Level of segmentation ('word').
	 * @param options - Options for word segmentation.
	 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
	 */
	rawSegments(
		granularity: "word",
		options: WordSegmentationOptions,
	): Iterable<Intl.SegmentData>;

	/**
	 * Returns raw segments of the string based on the specified granularity and options.
	 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
	 * @param options - Options for segmentation.
	 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
	 */
	rawSegments(
		granularity: Exclude<Granularity, "word">,
		options?: SegmentationOptions,
	): Intl.Segments;

	/**
	 * Returns raw segments of the string based on the specified granularity and options.
	 * @param granularity - Level of segmentation.
	 * @param options - Options for segmentation.
	 * @returns An iterable of `Intl.SegmentData` representing the raw segments.
	 */
	rawSegments(
		granularity: Granularity,
		options: SegmentationOptions | WordSegmentationOptions = {},
	): Intl.Segments | Iterable<Intl.SegmentData> {
		const { localesOverride = this.locales } = options;
		return getRawSegments(this.str, granularity, {
			...options,
			localesOverride,
		});
	}

	/**
	 * Returns the count of segments based on granularity and options.
	 * Supports additional options for 'word' granularity.
	 * @param granularity - Level of segmentation ('word').
	 * @param options - Options for word segmentation.
	 * @returns The number of segments.
	 */
	segmentCount(granularity: "word", options: WordSegmentationOptions): number;

	/**
	 * Returns the count of segments based on granularity and options.
	 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
	 * @param options - Options for segmentation.
	 * @returns The number of segments.
	 */
	segmentCount(
		granularity: Exclude<Granularity, "word">,
		options?: SegmentationOptions,
	): number;

	/**
	 * Returns the count of segments based on granularity and options.
	 * @param granularity - Level of segmentation.
	 * @param options - Options for segmentation.
	 * @returns The number of segments.
	 */
	segmentCount(
		granularity: Granularity,
		options: SegmentationOptions | WordSegmentationOptions = {},
	): number {
		const { localesOverride = this.locales } = options;
		return segmentCount(this.str, granularity, { ...options, localesOverride });
	}

	/**
	 * Returns the segment at a specified index for the given granularity and options.
	 * Supports additional options for 'word' granularity.
	 * @param index - Index of the desired segment (can be negative).
	 * @param granularity - Level of segmentation ('word').
	 * @param options - Options for word segmentation.
	 * @returns The segment at the specified index, or `undefined` if out of bounds.
	 */
	segmentAt(
		index: number,
		granularity: "word",
		options: WordSegmentationOptions,
	): string | undefined;

	/**
	 * Returns the segment at a specified index for the given granularity and options.
	 * @param index - Index of the desired segment (can be negative).
	 * @param granularity - Level of segmentation ('grapheme' or 'sentence').
	 * @param options - Options for segmentation.
	 * @returns The segment at the specified index, or `undefined` if out of bounds.
	 */
	segmentAt(
		index: number,
		granularity: Exclude<Granularity, "word">,
		options?: SegmentationOptions,
	): string | undefined;

	/**
	 * Returns the segment at a specified index for the given granularity and options.
	 * @param index - Index of the desired segment (can be negative).
	 * @param granularity - Level of segmentation.
	 * @param options - Options for segmentation.
	 * @returns The segment at the specified index, or `undefined` if out of bounds.
	 */
	segmentAt(
		index: number,
		granularity: Granularity,
		options: SegmentationOptions | WordSegmentationOptions = {},
	): string | undefined {
		const { localesOverride = this.locales } = options;
		return segmentAt(this.str, index, granularity, {
			...options,
			localesOverride,
		});
	}

	/** Returns an iterable of graphemes based on the options. */
	graphemes(options: SegmentationOptions = {}): Iterable<string> {
		return this.segments("grapheme", options);
	}

	/** Returns raw grapheme segments of the string based on the specified options. */
	rawGraphemes(options: SegmentationOptions = {}): Intl.Segments {
		return this.rawSegments("grapheme", options);
	}

	/** Returns the count of graphemes for the specified options. */
	graphemeCount(options: SegmentationOptions = {}): number {
		return this.segmentCount("grapheme", options);
	}

	/** Returns the grapheme at a specific index for the given options. */
	graphemeAt(
		index: number,
		options: SegmentationOptions = {},
	): string | undefined {
		return this.segmentAt(index, "grapheme", options);
	}

	/**
	 * Returns an iterable of word segments based on the specified options.
	 * @param options - Options for word segmentation.
	 * @returns An iterable of strings, each representing a word segment based on the options.
	 */
	words(options: WordSegmentationOptions = {}): Iterable<string> {
		return this.segments("word", options);
	}

	/**
	 * Returns an iterable of raw word segments based on the specified options.
	 * @param options - Options for word segmentation.
	 * @returns An iterable of `Intl.SegmentData` objects, each representing detailed data for a word segment.
	 */
	rawWords(options: WordSegmentationOptions = {}): Iterable<Intl.SegmentData> {
		return this.rawSegments("word", options);
	}

	/**
	 * Returns the count of words for the specified options.
	 * @param options - Options for word segmentation.
	 * @returns The number of word segments.
	 */
	wordCount(options: WordSegmentationOptions = {}): number {
		return this.segmentCount("word", options);
	}

	/**
	 * Returns the word at a specific index for the given options.
	 * @param index - Index of the desired word (can be negative).
	 * @param options - Options for word segmentation.
	 * @returns The word at the specified index, or `undefined` if out of bounds.
	 */
	wordAt(
		index: number,
		options: WordSegmentationOptions = {},
	): string | undefined {
		return this.segmentAt(index, "word", options);
	}

	/** Returns an iterable of sentences based on the options. */
	sentences(options: SegmentationOptions = {}): Iterable<string> {
		return this.segments("sentence", options);
	}

	/** Returns raw sentence segments of the string based on the specified options. */
	rawSentences(options: SegmentationOptions = {}): Intl.Segments {
		return this.rawSegments("sentence", options);
	}

	/** Returns the count of sentences for the specified options. */
	sentenceCount(options: SegmentationOptions = {}): number {
		return this.segmentCount("sentence", options);
	}

	/** Returns the sentence at a specific index for the given options. */
	sentenceAt(
		index: number,
		options: SegmentationOptions = {},
	): string | undefined {
		return this.segmentAt(index, "sentence", options);
	}

	[Symbol.iterator](): Iterator<string> {
		return this.graphemes()[Symbol.iterator]();
	}

	[Symbol.toPrimitive](hint: "string" | "number" | "default"): string | number {
		return hint === "string" || hint === "default" ? this.toString() : NaN;
	}

	toString(): string {
		return this.str;
	}
}
