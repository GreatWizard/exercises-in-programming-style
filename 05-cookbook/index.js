import fs from "fs";
import { isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

// The shared mutable data
let data = undefined;
let words = undefined;
const wordFreqs = [];

/*
 * The procedures
 */
function readFile(pathToFile) {
  // Takes a path to a file and assigns the entire contents of the file to the global variable data
  data = fs.readFileSync(pathToFile, "UTF-8");
}

function filterCharsAndNormalize() {
  // Replaces all nonalphanumeric chars in data with white space
  data = [...data]
    .map((c) => (isAlNum(c) ? c : " "))
    .join("")
    .trim()
    .toLowerCase();
}

function scan() {
  // Scans data for words, filling the global variable words
  words = data.split(/\s+/);
}

function removeStopWords() {
  const stopWords = fs
    .readFileSync("stop_words.txt", "UTF-8")
    .toString()
    .toLowerCase()
    .split(",");
  words = words.filter((word) => !stopWords.includes(word));
}

function frequencies() {
  // Creates a list of pairs associating words with frequencies
  words.forEach((word) => {
    const found = wordFreqs.find((pair) => pair.word === word);
    if (found) {
      found.freq++;
    } else {
      wordFreqs.push({ word, freq: 1 });
    }
  });
}

function sort() {
  // Sorts word_freqs by frequency
  wordFreqs.sort((a, b) =>
    b.freq - a.freq !== 0 ? b.freq - a.freq : b.word < a.word ? 1 : -1
  );
}

/*
 * The main function
 */
readFile(args[0]);
filterCharsAndNormalize();
scan();
removeStopWords();
frequencies();
sort();

wordFreqs
  .slice(0, 25)
  .forEach((pair) => console.log(`${pair.word} - ${pair.freq}`));
