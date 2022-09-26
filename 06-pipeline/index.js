import fs from "fs";
import { isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

/*
 * The functions
 */
function readFile(pathToFile) {
  // Takes a path to a file and assigns the entire contents of the file to the global variable data
  return fs.readFileSync(pathToFile, "UTF-8");
}

function filterCharsAndNormalize(data) {
  // Replaces all nonalphanumeric chars in data with white space
  return [...data]
    .map((c) => (isAlNum(c) ? c : " "))
    .join("")
    .trim()
    .toLowerCase();
}

function scan(data) {
  // Scans data for words, filling the global variable words
  return data.split(/\s+/);
}

function removeStopWords(words) {
  const stopWords = fs
    .readFileSync("stop_words.txt", "UTF-8")
    .toString()
    .toLowerCase()
    .split(",");
  return words.filter((word) => !stopWords.includes(word));
}

function frequencies(words) {
  // Creates a list of pairs associating words with frequencies
  return words.reduce((wordFreqs, word) => {
    const found = wordFreqs.find((pair) => pair.word === word);
    if (found) {
      found.freq++;
    } else {
      wordFreqs.push({ word, freq: 1 });
    }
    return wordFreqs;
  }, []);
}

function sort(wordFreqs) {
  // Sorts word_freqs by frequency
  return wordFreqs.sort((a, b) =>
    b.freq - a.freq !== 0 ? b.freq - a.freq : b.word < a.word ? 1 : -1
  );
}

function printAll(wordFreqs) {
  // Takes a list of pairs where the entries are sorted by frequency and print them recursively
  wordFreqs.forEach((pair) => console.log(`${pair.word} - ${pair.freq}`));
}

/*
 * The main function
 */
printAll(
  sort(
    frequencies(
      removeStopWords(scan(filterCharsAndNormalize(readFile(args[0]))))
    )
  ).slice(0, 25)
);
