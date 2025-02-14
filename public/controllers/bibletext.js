"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractBibleVerses = extractBibleVerses;
const numberWords = {
    one: "1", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
    eleven: "11", twelve: "12", thirteen: "13", fourteen: "14", fifteen: "15",
    sixteen: "16", seventeen: "17", eighteen: "18", nineteen: "19", twenty: "20",
    thirty: "30", forty: "40", fifty: "50", sixty: "60",
    seventy: "70", eighty: "80", ninety: "90",
    // Add ordinal words
    first: "1", second: "2", third: "3"
};
// Map for converting spelled-out book names
const bookNameMap = {
    "first timothy": "1 Timothy",
    "second timothy": "2 Timothy",
    "first corinthians": "1 Corinthians",
    "second corinthians": "2 Corinthians",
    "first thessalonians": "1 Thessalonians",
    "second thessalonians": "2 Thessalonians",
    "first peter": "1 Peter",
    "second peter": "2 Peter",
    "first john": "1 John",
    "second john": "2 John",
    "third john": "3 John",
    "first samuel": "1 Samuel",
    "second samuel": "2 Samuel",
    "first kings": "1 Kings",
    "second kings": "2 Kings",
    "first chronicles": "1 Chronicles",
    "second chronicles": "2 Chronicles"
};
function convertCompoundNumber(numStr) {
    const parts = numStr.split('-');
    if (parts.length === 2) {
        const tens = numberWords[parts[0].toLowerCase()] || "0";
        const ones = numberWords[parts[1].toLowerCase()] || "0";
        if (tens && ones) {
            return String(parseInt(tens) + parseInt(ones));
        }
    }
    return numberWords[numStr.toLowerCase()] || numStr;
}
function convertWordsToNumbers(text) {
    // Handle hyphenated numbers like "twenty-three"
    text = text.replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)-(one|two|three|four|five|six|seven|eight|nine)\b/gi, (match) => convertCompoundNumber(match));
    // Then handle single word numbers
    return text.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/gi, (match) => numberWords[match.toLowerCase()] || match);
}
function normalizeBookNames(text) {
    // Convert spelled-out ordinal book names
    for (const [spelled, standard] of Object.entries(bookNameMap)) {
        const regex = new RegExp(`\\b${spelled}\\b`, 'gi');
        text = text.replace(regex, standard);
    }
    return text;
}
// Updated book regex to include numeric prefixes
const bookRegex = "\\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\\b";
function extractBibleVerses(text) {
    // First normalize book names (convert "First Timothy" to "1 Timothy", etc.)
    text = normalizeBookNames(text);
    // Then convert number words to digits
    const convertedText = convertWordsToNumbers(text);
    // Three separate patterns for better clarity
    const patternWords = new RegExp(`(${bookRegex})\\s*,?\\s*chapter\\s+(\\w+)\\s*,?\\s*verse\\s+(\\w+)`, "gi");
    const patternNumeric = new RegExp(`(${bookRegex})\\s*(\\d+)\\s*:\\s*(\\d+)`, "gi");
    const patternShorthand = new RegExp(`(${bookRegex})\\s*(\\d+)\\s*,?\\s*verse\\s+(\\w+)`, "gi");
    let results = [];
    // First, try to match the numeric pattern (Book N:N)
    let numericMatches = [...convertedText.matchAll(patternNumeric)];
    for (const match of numericMatches) {
        const book = match[1];
        const chapter = match[2];
        const verse = match[3];
        if (book && chapter && verse) {
            results.push(`${book} ${chapter}:${verse}`);
        }
    }
    // Then, try to match the words pattern (Book chapter N, verse N)
    let wordMatches = [...convertedText.matchAll(patternWords)];
    for (const match of wordMatches) {
        const book = match[1];
        const chapter = match[2];
        const verse = match[3];
        if (book && chapter && verse) {
            results.push(`${book} ${chapter}:${verse}`);
        }
    }
    // Then, try to match the shorthand pattern (Book N, verse N)
    let shorthandMatches = [...convertedText.matchAll(patternShorthand)];
    for (const match of shorthandMatches) {
        const book = match[1];
        const chapter = match[2];
        const verse = match[3];
        if (book && chapter && verse) {
            results.push(`${book} ${chapter}:${verse}`);
        }
    }
    return results;
}
// Test with your specific examples
console.log(extractBibleVerses("First Timothy chapter 1, verse 2.")); // Should return ["1 Timothy 1:2"]
console.log(extractBibleVerses("John 3:16 and Luke 4:14.")); // Should return ["John 3:16", "Luke 4:14"]
console.log(extractBibleVerses("Jeremiah 1, verse 2.")); // Should return ["Jeremiah 1:2"]
