import fs from 'fs';
import path from 'path';

// Define the type structure of the Bible JSON
interface BibleData {
    [book: string]: {
        [chapter: string]: {
            [verse: string]: string;
        };
    };
}

// Get the absolute path to bible.json
const biblePath: string = path.join(__dirname, '../../bible.json');

// Function to read the JSON file
function loadBible(): BibleData | null {
    try {
        const data: string = fs.readFileSync(biblePath, 'utf8');
        return JSON.parse(data) as BibleData;
    } catch (error) {
        console.error("Error reading bible.json:", error);
        return null;
    }
}

// Map of shortened book names to full names
const bookNameMap: { [key: string]: string } = {
    "act": "Acts",
    "jn": "John",
    "1jn": "1 John",
    "2jn": "2 John",
    "3jn": "3 John",
    "1sam": "1 Samuel",
    "2sam": "2 Samuel",
    "1kgs": "1 Kings",
    "2kgs": "2 Kings",
    "1chr": "1 Chronicles",
    "2chr": "2 Chronicles",
    "1cor": "1 Corinthians",
    "2cor": "2 Corinthians",
    "1thes": "1 Thessalonians",
    "2thes": "2 Thessalonians",
    "1tim": "1 Timothy",
    "2tim": "2 Timothy",
    "1pet": "1 Peter",
    "2pet": "2 Peter",
    "1jhn": "1 John",
    "2jhn": "2 John",
    "3jhn": "3 John",
    "jude": "Jude",
    "rev": "Revelation",
};

// Function to normalize book names
function normalizeBookName(book: string): string {
    // Convert to lowercase and remove non-alphanumeric characters
    const normalized = book.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if the normalized name exists in the map
    return bookNameMap[normalized] || book;
}

// Function to get verses
export function getVerses(references: string[]): { reference: string; verse: string }[] {
    const bibleData = loadBible();
    if (!bibleData) return [{ reference: "Error", verse: "Bible data not available" }];

    return references.map(ref => {
        // Split the reference into book and chapter:verse
        const [bookPart, chapterVerse] = ref.split(/(?<=\D)\s+/); // Split on the last space before a number
        const [chapter, verse] = chapterVerse.split(":");

        // Normalize the book name
        const book = normalizeBookName(bookPart);

        // Get the verse text
        const verseText: string = bibleData[book]?.[chapter]?.[verse] || "Verse not found";
        return { reference: ref, verse: verseText };
    });
}

// Example usage
const references: string[] = ["1 John 1:2", "Acts 3:2", "Isaiah 4:3", "Acts 4:4"];
console.log(JSON.stringify(getVerses(references), null, 2));