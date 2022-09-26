import fs from "fs";
import { isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

const stopWords = fs
  .readFileSync("stop_words.txt", "UTF-8")
  .toString()
  .toLowerCase()
  .split(",");

[...fs.readFileSync(args[0], "UTF-8")]
  .map((c) => (isAlNum(c) ? c : " "))
  .join("")
  .trim()
  .toLowerCase()
  .split(/\s+/)
  .filter((word) => !stopWords.includes(word))
  .reduce((wordFreqs, word) => {
    const found = wordFreqs.find((pair) => pair.word === word);
    if (found) {
      found.freq++;
    } else {
      wordFreqs.push({ word, freq: 1 });
    }
    return wordFreqs;
  }, [])
  .sort((a, b) =>
    b.freq - a.freq !== 0 ? b.freq - a.freq : b.word < a.word ? 1 : -1
  )
  .slice(0, 25)
  .forEach((pair) => console.log(`${pair.word} - ${pair.freq}`));
