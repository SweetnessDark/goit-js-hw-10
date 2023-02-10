const URL = 'https://restcountries.com/v3.1/name/';

function fetchCountries(name) {
    return fetch(`${URL}${name}?fields=name,capital,population,flags,languages`)
    .then((response) => {
        if (response.status === 404) {
            return Promise.reject(new Error());
        }
        return response.json()
    });
}

export default fetchCountries;