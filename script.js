const wrapper = document.querySelector('.wrapper'),
    searchInput = wrapper.querySelector('input'),
    infoText = wrapper.querySelector('.info-text'),
    synonyms = wrapper.querySelector('.synonyms .list'),
    removeIcon = wrapper.querySelector('.search span');

// Data
function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>${word}</span>. Please, try to search for another word.`;
    } else {
        wrapper.classList.add('active');
        let definitions = result[0].meanings[0].definitions[0],
            phonetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}`;

        document.querySelector('.word p').innerText = result[0].word;
        document.querySelector('.word span').innerText = phonetics;
        document.querySelector('.meaning span').innerText =
            definitions.definition;
        document.querySelector('.example span').innerText = definitions.example;

        if (definitions.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = 'none';
        } else {
            synonyms.parentElement.style.display = 'block';
            synonyms.innerHTML = '';

            for (let i = 0; i < 5; i++) {
                let tag = `<span onClick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;

                tag =
                    i == 4
                        ? tag`<span onClick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`
                        : tag;

                synonyms.insertAdjacentHTML('beforeend', tag);
            }
        }
    }
}

function search(word) {
    fetchApi(word);
    searchInput.value = word;
}

// Fetch The Api
function fetchApi(word) {
    wrapper.classList.remove('active');
    infoText.style.color = '#000';
    infoText.innerHTML = `Searching the meaning of <span>${word}</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then((response) => response.json())
        .then((result) => data(result, word))
        .catch(() => {
            infoText.innerHTML = `Can't find the meaning of <span>${word}</span>. Please, try to search for another word.`;
        });
}

searchInput.addEventListener('keyup', (e) => {
    let word = e.target.value.replace(/s\+/g, ' ');
    if (e.key == 'Enter' && word) {
        fetchApi(word);
    }
});

removeIcon.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    wrapper.classList.remove('active');
    infoText.style.color = '#9a9a9a';
    infoText.innerHTML =
        'Type any existing word and press enter to get meaning, example, synonyms, etc.';
});
