const sumToHundred = url => {
  let wordsThatSumToHundred = '';
  let count = 0;
  const outputHTML = document.querySelector('#app');
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyurl + url)
    .then(response => response.json())
    .then(myDictionary => {
      for (let word in myDictionary) {
        const letters = Array.from(word.toLowerCase());
        const sum = letters.reduce(
          (acc, val) => acc + val.charCodeAt(0) - 96,
          0
        );
        if (sum === 100) {
          count++;
          wordsThatSumToHundred += word + '<br>';
        }
      }
      outputHTML.innerHTML += `
      <p><span class="bold">Word count:</span> ${count}</p>
      <br><br>
      <p><span class="bold underline">Words:</span><br>${wordsThatSumToHundred}</p>      
      `;
    });
};
sumToHundred(
  'https://github.com/dwyl/english-words/raw/master/words_dictionary.json'
);
