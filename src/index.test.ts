import { describe, it, expect } from "vitest";
import {
	getSegments,
	segmentCount,
	rawSegmentAt,
	segmentAt,
	SegmentString,
	GraphemeString,
	WordString,
	SentenceString,
} from "./index.js";

describe("String Segmentation Utilities", () => {
	const testString = "Hello, world! This is a test.";
	const testLocales: Intl.LocalesArgument = "en-US";

	describe("getSegments", () => {
		it("should segment a string by grapheme", () => {
			const segments = Array.from(
				getSegments(testString, "grapheme", testLocales),
			);
			expect(segments).toContain("H");
			expect(segments.length).toBeGreaterThan(0);
		});

		it("should segment a string by word", () => {
			const segments = Array.from(getSegments(testString, "word", testLocales));
			expect(segments).toContain("Hello");
			expect(segments).toContain("world");
			expect(segments.length).toBeGreaterThan(1);
		});

		it("should segment a string by sentence", () => {
			const segments = Array.from(
				getSegments(testString, "sentence", testLocales),
			);
			expect(segments).toContain("Hello, world! ");
			expect(segments).toContain("This is a test.");
			expect(segments.length).toBeGreaterThan(1);
		});
	});

	describe("segmentCount", () => {
		it("should return the correct count of segments", () => {
			expect(segmentCount(testString, "grapheme", testLocales)).toBeGreaterThan(
				0,
			);
			expect(segmentCount(testString, "word", testLocales)).toBe(14);
			expect(segmentCount(testString, "sentence", testLocales)).toBe(2);
		});
	});

	describe("rawSegmentAt", () => {
		it("should return the correct segment data at the specified index", () => {
			const segmentData = rawSegmentAt(testString, 3, "word", testLocales);
			expect(segmentData).toBeDefined();
			expect(segmentData?.segment).toBe("world");
		});

		it("should return undefined if the index is out of bounds", () => {
			const segmentData = rawSegmentAt(testString, 100, "word", testLocales);
			expect(segmentData).toBeUndefined();
		});
	});

	describe("segmentAt", () => {
		it("should return the correct segment string at the specified index", () => {
			const segment = segmentAt(testString, 3, "word", testLocales);
			expect(segment).toBe("world");
		});

		it("should return undefined if the index is out of bounds", () => {
			const segment = segmentAt(testString, 100, "word", testLocales);
			expect(segment).toBeUndefined();
		});
	});

	describe("SegmentString Class", () => {
		const segmentString = new SegmentString(testString, testLocales);

		it("should return segments for a specific granularity", () => {
			const segments = Array.from(segmentString.segments("word"));
			expect(segments).toContain("Hello");
			expect(segments).toContain("world");
		});

		it("should return the segment count for a given granularity", () => {
			expect(segmentString.segmentCount("word")).toBe(14);
			expect(segmentString.segmentCount("sentence")).toBe(2);
		});

		it("should return the segment at a specific index", () => {
			expect(segmentString.segmentAt(3, "word")).toBe("world");
		});
	});

	describe("GraphemeString Class", () => {
		const graphemeString = new GraphemeString(testString, testLocales);

		it("should return graphemes", () => {
			const graphemes = Array.from(graphemeString.graphemes());
			expect(graphemes.length).toBeGreaterThan(0);
		});

		it("should return the grapheme count", () => {
			expect(graphemeString.graphemeCount()).toBeGreaterThan(0);
		});

		it("should return the grapheme at a specific index", () => {
			const grapheme = graphemeString.graphemeAt(0);
			expect(grapheme).toBe("H");
		});
	});

	describe("WordString Class", () => {
		const wordString = new WordString(testString, testLocales);

		it("should return words", () => {
			const words = Array.from(wordString.words());
			expect(words).toContain("Hello");
			expect(words).toContain("world");
		});

		it("should return the word count", () => {
			expect(wordString.wordCount()).toBe(14);
		});

		it("should return the word at a specific index", () => {
			expect(wordString.wordAt(3)).toBe("world");
		});
	});

	describe("SentenceString Class", () => {
		const sentenceString = new SentenceString(testString, testLocales);

		it("should return sentences", () => {
			const sentences = Array.from(sentenceString.sentences());
			expect(sentences).toContain("Hello, world! ");
			expect(sentences).toContain("This is a test.");
		});

		it("should return the sentence count", () => {
			expect(sentenceString.sentenceCount()).toBe(2);
		});

		it("should return the sentence at a specific index", () => {
			expect(sentenceString.sentenceAt(0)).toBe("Hello, world! ");
		});
	});
});
