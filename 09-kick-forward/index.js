import fs from "fs";
import { isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

/*
 * The functions
 */
function readFile(pathToFile, func) {
  const data = fs.readFileSync(pathToFile, "UTF-8");
  func(data, scan);
}

function filterCharsAndNormalize(data, func) {
  const newData = [...data]
    .map((c) => (isAlNum(c) ? c : " "))
    .join("")
    .trim()
    .toLowerCase();
  func(newData, removeStopWords);
}

function scan(data, func) {
  const words = data.split(/\s+/);
  func(words, frequencies);
}

function removeStopWords(words, func) {
  const stopWords = fs
    .readFileSync("stop_words.txt", "UTF-8")
    .toString()
    .toLowerCase()
    .split(",");
  const newWords = words.filter((word) => !stopWords.includes(word));
  func(newWords, sort);
}

function frequencies(words, func) {
  const wordFreqs = words.reduce((wordFreqs, word) => {
    const found = wordFreqs.find((pair) => pair.word === word);
    if (found) {
      found.freq++;
    } else {
      wordFreqs.push({ word, freq: 1 });
    }
    return wordFreqs;
  }, []);
  func(wordFreqs, printAll);
}

function sort(wordFreqs, func) {
  const newWordFreqs = wordFreqs.sort((a, b) =>
    b.freq - a.freq !== 0 ? b.freq - a.freq : b.word < a.word ? 1 : -1
  );
  func(newWordFreqs, noop);
}

function printAll(wordFreqs, func) {
  wordFreqs.slice(0, 25).forEach((pair) => console.log(`${pair.word} - ${pair.freq}`));
  func();
}

function noop() {
  return;
}

/*
 * The main function
 */
readFile(args[0], filterCharsAndNormalize);
