import {
	getRawSegments,
	getSegments,
	segmentCount,
	segmentAt,
	filterRawWordLikeSegments,
	filterWordLikeSegments,
	SegmentString,
} from "./index.js";

import { describe, it, expect } from "vitest";

describe("Segmentation Functions", () => {
	const testString = "Hello, world! こんにちは世界！";

	describe("getRawSegments", () => {
		it("should return raw grapheme segments", () => {
			const segments = getRawSegments(testString, "grapheme");
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual([
				"H",
				"e",
				"l",
				"l",
				"o",
				",",
				" ",
				"w",
				"o",
				"r",
				"l",
				"d",
				"!",
				" ",
				"こ",
				"ん",
				"に",
				"ち",
				"は",
				"世",
				"界",
				"！",
			]);
		});

		it("should return raw word segments without filtering", () => {
			const segments = getRawSegments(testString, "word");
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual([
				"Hello",
				",",
				" ",
				"world",
				"!",
				" ",
				"こんにちは",
				"世界",
				"！",
			]);
		});

		it("should return raw word-like segments when isWordLike is true", () => {
			const segments = getRawSegments(testString, "word", { isWordLike: true });
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual(["Hello", "world", "こんにちは", "世界"]);
		});

		it("should return raw sentence segments", () => {
			const segments = getRawSegments(testString, "sentence");
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual(["Hello, world! ", "こんにちは世界！"]);
		});
	});

	describe("getSegments", () => {
		it("should return grapheme segments", () => {
			const segments = getSegments(testString, "grapheme");
			const result = [...segments];
			expect(result).toEqual([
				"H",
				"e",
				"l",
				"l",
				"o",
				",",
				" ",
				"w",
				"o",
				"r",
				"l",
				"d",
				"!",
				" ",
				"こ",
				"ん",
				"に",
				"ち",
				"は",
				"世",
				"界",
				"！",
			]);
		});

		it("should return word segments without filtering", () => {
			const segments = getSegments(testString, "word");
			const result = [...segments];
			expect(result).toEqual([
				"Hello",
				",",
				" ",
				"world",
				"!",
				" ",
				"こんにちは",
				"世界",
				"！",
			]);
		});

		it("should return word-like segments when isWordLike is true", () => {
			const segments = getSegments(testString, "word", { isWordLike: true });
			const result = [...segments];
			expect(result).toEqual(["Hello", "world", "こんにちは", "世界"]);
		});

		it("should return sentence segments", () => {
			const segments = getSegments(testString, "sentence");
			const result = [...segments];
			expect(result).toEqual(["Hello, world! ", "こんにちは世界！"]);
		});
	});

	describe("segmentCount", () => {
		it("should count grapheme segments", () => {
			const count = segmentCount(testString, "grapheme");
			expect(count).toBe(22);
		});

		it("should count word segments without filtering", () => {
			const count = segmentCount(testString, "word");
			expect(count).toBe(9);
		});

		it("should count word-like segments when isWordLike is true", () => {
			const count = segmentCount(testString, "word", { isWordLike: true });
			expect(count).toBe(4);
		});

		it("should count sentence segments", () => {
			const count = segmentCount(testString, "sentence");
			expect(count).toBe(2);
		});
	});

	describe("segmentAt", () => {
		it("should return the grapheme at a specific index", () => {
			const segment = segmentAt(testString, 0, "grapheme");
			expect(segment).toBe("H");
		});

		it("should return the last grapheme using negative index", () => {
			const segment = segmentAt(testString, -1, "grapheme");
			expect(segment).toBe("！");
		});

		it("should return the word at a specific index without filtering", () => {
			const segment = segmentAt(testString, 3, "word");
			expect(segment).toBe("world");
		});

		it("should return the word-like segment at a specific index when isWordLike is true", () => {
			const segment = segmentAt(testString, 1, "word", { isWordLike: true });
			expect(segment).toBe("world");
		});

		it("should return undefined for out-of-bounds index", () => {
			const segment = segmentAt(testString, 100, "word");
			expect(segment).toBeUndefined();
		});
	});

	describe("filterRawWordLikeSegments", () => {
		it("should filter raw word-like segments", () => {
			const segments = getRawSegments(testString, "word", { isWordLike: true });
			const filteredSegments = filterRawWordLikeSegments(segments);
			const result = [...filteredSegments].map((s) => s.segment);
			expect(result).toEqual(["Hello", "world", "こんにちは", "世界"]);
		});
	});

	describe("filterWordLikeSegments", () => {
		it("should filter word-like segments", () => {
			const segments = getRawSegments(testString, "word", { isWordLike: true });
			const filteredSegments = filterWordLikeSegments(segments);
			const result = [...filteredSegments];
			expect(result).toEqual(["Hello", "world", "こんにちは", "世界"]);
		});
	});
});

describe("SegmentString Class", () => {
	const rawTestString = "Hello, world! こんにちは世界！";
	const testString = new SegmentString(rawTestString);

	describe("graphemes", () => {
		it("should return grapheme segments", () => {
			const segments = testString.graphemes();
			const result = [...segments];
			expect(result).toEqual([
				"H",
				"e",
				"l",
				"l",
				"o",
				",",
				" ",
				"w",
				"o",
				"r",
				"l",
				"d",
				"!",
				" ",
				"こ",
				"ん",
				"に",
				"ち",
				"は",
				"世",
				"界",
				"！",
			]);
		});

		it("should return the count of graphemes", () => {
			const count = testString.graphemeCount();
			expect(count).toBe(22);
		});

		it("should return the grapheme at a specific index", () => {
			const segment = testString.graphemeAt(0);
			expect(segment).toBe("H");
		});

		it("should return undefined for out-of-bounds index", () => {
			const segment = testString.graphemeAt(100);
			expect(segment).toBeUndefined();
		});
	});

	describe("words", () => {
		it("should return word segments without filtering", () => {
			const segments = testString.words();
			const result = [...segments];
			expect(result).toEqual([
				"Hello",
				",",
				" ",
				"world",
				"!",
				" ",
				"こんにちは",
				"世界",
				"！",
			]);
		});

		it("should return word-like segments when isWordLike is true", () => {
			const segments = testString.words({ isWordLike: true });
			const result = [...segments];
			expect(result).toEqual(["Hello", "world", "こんにちは", "世界"]);
		});

		it("should return the count of words without filtering", () => {
			const count = testString.wordCount();
			expect(count).toBe(9);
		});

		it("should return the count of word-like segments when isWordLike is true", () => {
			const count = testString.wordCount({ isWordLike: true });
			expect(count).toBe(4);
		});

		it("should return the word at a specific index without filtering", () => {
			const segment = testString.wordAt(3);
			expect(segment).toBe("world");
		});

		it("should return the word-like segment at a specific index when isWordLike is true", () => {
			const segment = testString.wordAt(1, { isWordLike: true });
			expect(segment).toBe("world");
		});
	});

	describe("sentences", () => {
		it("should return sentence segments", () => {
			const segments = testString.sentences();
			const result = [...segments];
			expect(result).toEqual(["Hello, world! ", "こんにちは世界！"]);
		});

		it("should return the count of sentences", () => {
			const count = testString.sentenceCount();
			expect(count).toBe(2);
		});

		it("should return the sentence at a specific index", () => {
			const segment = testString.sentenceAt(0);
			expect(segment).toBe("Hello, world! ");
		});
	});

	describe("rawSegments", () => {
		it("should return raw grapheme segments", () => {
			const segments = testString.rawGraphemes();
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual([
				"H",
				"e",
				"l",
				"l",
				"o",
				",",
				" ",
				"w",
				"o",
				"r",
				"l",
				"d",
				"!",
				" ",
				"こ",
				"ん",
				"に",
				"ち",
				"は",
				"世",
				"界",
				"！",
			]);
		});

		it("should return raw word segments without filtering", () => {
			const segments = testString.rawWords();
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual([
				"Hello",
				",",
				" ",
				"world",
				"!",
				" ",
				"こんにちは",
				"世界",
				"！",
			]);
		});

		it("should return raw word-like segments when isWordLike is true", () => {
			const segments = testString.rawWords({ isWordLike: true });
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual(["Hello", "world", "こんにちは", "世界"]);
		});

		it("should return raw sentence segments", () => {
			const segments = testString.rawSentences();
			const result = [...segments].map((s) => s.segment);
			expect(result).toEqual(["Hello, world! ", "こんにちは世界！"]);
		});
	});

	describe("toString and Symbol.toPrimitive", () => {
		it("should return the original string using toString", () => {
			expect(testString.toString()).toBe("Hello, world! こんにちは世界！");
		});

		it("should return the original string when used in a template literal", () => {
			expect(`${testString}`).toBe("Hello, world! こんにちは世界！");
		});

		it("should return NaN when coerced to a number", () => {
			expect(+testString).toBeNaN();
		});
	});

	describe("Iteration", () => {
		it("should be iterable over graphemes by default", () => {
			const result = [...testString];
			expect(result).toEqual([
				"H",
				"e",
				"l",
				"l",
				"o",
				",",
				" ",
				"w",
				"o",
				"r",
				"l",
				"d",
				"!",
				" ",
				"こ",
				"ん",
				"に",
				"ち",
				"は",
				"世",
				"界",
				"！",
			]);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty strings", () => {
			const emptyString = new SegmentString("");
			expect([...emptyString.graphemes()]).toEqual([]);
			expect(emptyString.graphemeCount()).toBe(0);
			expect(emptyString.graphemeAt(0)).toBeUndefined();
		});

		it("should handle strings with emojis and complex characters", () => {
			const emojiString = new SegmentString("👨‍👩‍👧‍👦 family");
			const graphemes = [...emojiString.graphemes()];
			expect(graphemes).toEqual(["👨‍👩‍👧‍👦", " ", "f", "a", "m", "i", "l", "y"]);
		});

		it("should convert to a string", () => {
			expect(testString.toString()).toBe(rawTestString);
			expect(`${testString}`).toBe(rawTestString);
		});
	});
});
