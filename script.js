const searchFeald = document.querySelector('.search');
const searchList = document.querySelector('.listResults');
const container = document.querySelector('.container');

let run = true;

let option = document.querySelectorAll('option')
let obj = {};
const fragment = document.createDocumentFragment();

const debounce = (fn, debounceTime) => {
    let timeout;
    return function() {
        const fnCall = () => {fn.apply(this, arguments)};
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime);  
    }
};

function removeWarningMessage() {
    let warning = document.querySelector('.errorResult');
    if (warning) {
        warning.remove();
    }
}

function addResult(e) {
    let elContainer = document.createElement('div');
    elContainer.classList.add('container__el');
    let ul = document.createElement('ul');
    let el1 = document.createElement('li');
    let el2 = document.createElement('li');
    let el3 = document.createElement('li');
    el1.textContent = `Name: ${e.target.textContent}`;
    el2.textContent = `Owner: ${obj[e.target.textContent].owner}`;
    el3.textContent = `Stars: ${obj[e.target.textContent].stars}`;
    ul.classList.add('container__text');
    ul.appendChild(el1);
    ul.appendChild(el2);
    ul.appendChild(el3);
    elContainer.appendChild(ul);
    let btn = document.createElement('button');
    btn.classList.add('container__btn');
    elContainer.appendChild(btn);
    container.appendChild(elContainer);
    searchFeald.value = '';
    obj = {};
    for (let i=0;i<5;i++) {
    searchList.firstChild.remove();
    run = true;
    }    
    searchList.classList.add('search__List');
}

function onChange(e) {
    removeWarningMessage();
        if (searchFeald.value.trim()) {
        let url = `https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`; 
            return fetch(url)
            .then(response=>{
                return response.json();   
            })
            .then(result=>{
                let results = result.items;
                if(results.length == 0) {
                    let errorResult = document.createElement('option');
                    errorResult.classList.add('errorResult');
                    errorResult.textContent = 'Not found such repositories';
                    searchFeald.insertAdjacentElement('afterend', errorResult);
                }
                else {
                    results.forEach(element => {
                        let el = {
                            'name': element.name,
                            'owner': element.owner['login'],
                            'stars': element.forks_count
                        }
                        obj[element.name] = el;
                        let elResults = document.createElement('option');
                        elResults.classList.add('listResults__el');
                        elResults.textContent = element.name;
                        fragment.appendChild(elResults);
                    });
                    run = false;
                    searchList.appendChild(fragment);  
                    searchList.classList.remove('search__List');
                }

            })
    }
}

onChange = debounce(onChange, 600);

function emptyField() {
    if (searchFeald.value.trim() && searchList.firstChild) {
        for (let i=0;i<5;i++) {
            searchList.firstChild.remove();
            run = true;
            }   
        searchList.classList.add('search__List');
    }
}

let btnRemove = document.querySelectorAll('.container__btn');
function removeEl(e) {
    if (e.target.classList == 'container__btn') {
        e.target.parentElement.remove();
    }
}

searchFeald.addEventListener('input', onChange);  
searchFeald.addEventListener('input', emptyField);  
searchList.addEventListener('click', addResult);
container.addEventListener('click', removeEl);