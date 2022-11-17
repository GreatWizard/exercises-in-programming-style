import fs from "fs";
import { isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

class TFTheOne {
  _value;

  constructor(pathToFile) {
    this._value = pathToFile;
  }

  bind(func) {
    this._value = func(this._value);
    return this;
  }

  printMe() {
    console.log(this._value);
  }
}

/*
 * The functions
 */
function readFile(pathToFile) {
  return fs.readFileSync(pathToFile, "UTF-8");
}

function filterCharsAndNormalize(data) {
  return [...data]
    .map((c) => (isAlNum(c) ? c : " "))
    .join("")
    .trim()
    .toLowerCase();
}

function scan(data) {
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
  return wordFreqs.sort((a, b) =>
    b.freq - a.freq !== 0 ? b.freq - a.freq : b.word < a.word ? 1 : -1
  );
}

function top25Freqs(wordFreqs) {
  return wordFreqs
    .slice(0, 25)
    .reduce(
      (acc, pair) =>
        (acc += `${acc !== "" ? "\n" : ""}${pair.word} - ${pair.freq}`),
      ""
    );
}

/*
 * The main function
 */
new TFTheOne(args[0])
  .bind(readFile)
  .bind(filterCharsAndNormalize)
  .bind(scan)
  .bind(removeStopWords)
  .bind(frequencies)
  .bind(sort)
  .bind(top25Freqs)
  .printMe();
