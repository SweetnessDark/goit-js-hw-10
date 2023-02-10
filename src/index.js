import './css/styles.css';
import fetchCountries from "./fetchCountries.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener("input", debounce(inputChange, DEBOUNCE_DELAY));

function inputChange(e) {
    e.preventDefault();

    const countryName = e.target.value.trim();

    if(!countryName) {
        clearSearchBox();
        return;
    }

    fetchCountries(countryName)
    .then(data => {
        if(data.length > 10) {
            onSpecificName();
            clearSearchBox();
            return;
        }
        renderCountryBox(data);
    })
    .catch(error => {
      clearSearchBox();
      onError();
    })
}

function renderCountryBox(element) {
    let countryBoxes = '';
    let nameCountry = '';
    clearSearchBox();

    if (element.length === 1) {
      countryBoxes = createMarkup(element);
      nameCountry = countryInfo;
    } else {
      countryBoxes = createMarkupList(element);
      nameCountry = countryList;
    }

    updateCountry(nameCountry, countryBoxes);
}

function updateCountry(elem, markup) {
    elem.innerHTML = markup;
}

function createMarkup(element) {
    return element.map(({ name, capital, population, flags, languages }) =>
        `<img
        src="${flags.svg}" 
        alt="${name.official}" 
        width="120" 
        height="80">
        <h1 class="country-info-title">${name.official}</h1>
        <ul class="country-info-list">
        <li class="country-info-item">
        <span>Capital:</span>
        ${capital}
        </li>
        <li class="country-info-item">
        <span>Population:</span>
        ${population}
        </li>
        <li class="country-info-item">
        <span>Languages:</span>
        ${Object.values(languages)}
        </li>
        </ul>`
    );
}

function createMarkupList(element) {
    return element.map(({ name, flags }) =>
        `<li class="country-list-item">
        <img class="country-list-img" 
        src="${flags.svg}" 
        alt="${name.official}" 
        width="60" 
        height="40">
        ${name.official}
        </li>`
    ).join('');
}

function onSpecificName() {
    Notify.info('Too many matches found. Please enter a more specific name.');
}

function onError() {
    Notify.failure('Oops, there is no country with that name');
}

function clearSearchBox() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}
