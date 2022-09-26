import fs from "fs";
import { isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

function count(words, stopWords, wordFreqs) {
  // What to do with an empty list
  if (words.length === 0) {
    return [];
  }
  // The inductive case, what to do with a list of words
  // Process the tail word
  const word = words.pop();
  if (!stopWords.includes(word)) {
    const found = wordFreqs.find((pair) => pair.word === word);
    if (found) {
      found.freq++;
    } else {
      wordFreqs.push({ word, freq: 1 });
    }
  }
  // Process the rest
  count(words, stopWords, wordFreqs);
}

function print(wordFreqs) {
  // Reverse the list to use pop function
  _print(wordFreqs.reverse());
}

function _print(wordFreqs) {
  // What to do with an empty list
  if (wordFreqs.length === 0) {
    return;
  }
  // The inductive case, what to do with a list of words
  // Process the tail word
  const pair = wordFreqs.pop();
  console.log(`${pair.word} - ${pair.freq}`);
  // Process the rest
  _print(wordFreqs);
}

const stopWords = fs
  .readFileSync("stop_words.txt", "UTF-8")
  .toString()
  .toLowerCase()
  .split(",");

const words = [...fs.readFileSync(args[0], "UTF-8")]
  .map((c) => (isAlNum(c) ? c : " "))
  .join("")
  .trim()
  .toLowerCase()
  .split(/\s+/);

const wordFreqs = [];

count(words, stopWords, wordFreqs);
print(
  wordFreqs
    .sort((a, b) =>
      b.freq - a.freq !== 0 ? b.freq - a.freq : b.word < a.word ? 1 : -1
    )
    .slice(0, 25)
);
