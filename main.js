const checkButton = document.querySelector('#check-button');
const resetButton = document.querySelector('#reset-button');
const outputHTML = document.querySelector('main');
const sumInput = document.querySelector('#sum-input');
const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // Allows me to use fetch without throwing a CORS error
const url = 'https://github.com/dwyl/english-words/raw/master/words_dictionary.json'; // Dictionary

function checkInput(value) {
  return /[\d+]/.test(value); // Only allow integer numbers
}

function reset() {
  if (document.querySelector(`#count-output`)) document.querySelector(`#count-output`).remove();
  if (document.querySelector(`#error-output`)) document.querySelector(`#error-output`).remove();
  if (document.querySelector(`#word-output`)) document.querySelector(`#word-output`).remove();
  if (document.querySelector(`#wait-output`)) document.querySelector(`#wait-output`).remove();
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function sumOfLetters(event) {
  event.preventDefault(); // Prevent page reload when the check button is clicked
  try {
    const input = sumInput.value; // Get sum of letters value from the page

    if (checkInput(input)) {
      reset();

      const waitOutput = document.createElement('p');
      waitOutput.textContent = `Retrieving the words... Please wait.`;
      waitOutput.setAttribute('id', 'wait-output');
      outputHTML.append(waitOutput);

      fetch(proxyurl + url)
        .then(response => response.json())
        .then(data => {
          let count = 0;
          let wordsThatSumToHundred = [];
          for (let word in data) {
            const letters = Array.from(word.toLowerCase());
            const sum = letters.reduce((acc, val) => acc + val.charCodeAt(0) - 96, 0);
            if (sum === Number(input)) {
              count++;
              wordsThatSumToHundred.push(word);
            }
          }
          return { count: count, words: wordsThatSumToHundred };
        })
        .then(result => {
          reset();

          const countOutput = document.createElement('p');
          const wordOutput = document.createElement('ol');

          countOutput.setAttribute('id', 'count-output');
          countOutput.innerText = `Words that sum up to ${input}: ${result.count} words.`;

          wordOutput.setAttribute('id', 'word-output');
          result.words.forEach(word => {
            const wordItem = document.createElement('li');
            wordItem.classList.add('words');
            wordItem.textContent = capitalize(word);
            wordOutput.append(wordItem);
          });

          outputHTML.append(countOutput);
          outputHTML.append(wordOutput);
        });
    } else {
      throw new Error('Invalid input. Please enter a number');
    }
  } catch (err) {
    reset();
    const errorOutput = document.createElement('p');
    errorOutput.textContent = err.message;
    errorOutput.setAttribute('id', 'error-output');
    outputHTML.append(errorOutput);
  }
}

checkButton.onclick = sumOfLetters;
resetButton.onclick = reset;
