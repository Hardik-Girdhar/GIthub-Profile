
const APIURL = "https://api.github.com/users/";
const main = document.querySelector("#main");
const searchBox = document.querySelector("#search");

let currentPage = 1;
const reposPerPage = 3;
let totalRepos = 0;
let currentUsername = '';

const getUser = async (username) => {
    try {
        const response = await fetch(APIURL + username);
        if (!response.ok) {
            throw new Error('User not found');
        }
        const data = await response.json();
        currentUsername = username;
        totalRepos = data.public_repos;
        currentPage = 1;
        const card = `
            <div class="card">
                <div>
                    <img class="avatar" src="${data.avatar_url}" alt="${data.name}">
                </div>
                <div class="user-info">
                    <h2>${data.name}</h2>
                    <p>${data.bio}</p>
                    <ul class="info">
                        <li>${data.followers}<strong>Followers</strong></li>
                        <li>${data.following}<strong>Following</strong></li>
                        <li>${data.public_repos}<strong>Repos</strong></li>
                    </ul>
                    <div id="repos"></div>
                    <div class="pagination">
                        <button id="prev" onclick="prevPage()">Previous</button>
                        <button id="next" onclick="nextPage()">Next</button>
                    </div>
                </div>
            </div>
        `;
        main.innerHTML = card;
        getRepos(username, currentPage);
    } catch (error) {
        main.innerHTML = `<p class="error">${error.message}</p>`;
    }
};

const getRepos = async (username, page) => {
    try {
        const repos = document.querySelector("#repos");
        const response = await fetch(`${APIURL}${username}/repos?per_page=${reposPerPage}&page=${page}`);
        if (!response.ok) {
            throw new Error('Unable to fetch repositories');
        }
        const data = await response.json();
        repos.innerHTML = "";  // Clear previous repositories
        data.forEach((item) => {
            const elem = document.createElement("a");
            elem.classList.add("repo");
            elem.href = item.html_url;
            elem.innerText = item.name;
            elem.target = "_blank";
            repos.appendChild(elem);
        });
        updatePaginationButtons();
    } catch (error) {
        const repos = document.querySelector("#repos");
        repos.innerHTML = `<p class="error">${error.message}</p>`;
    }
};

const formSubmit = () => {
    if (searchBox.value !== "") {
        getUser(searchBox.value);
        searchBox.value = "";
    }
    return false;
};

searchBox.addEventListener("focusout", formSubmit);

const prevPage = () => {
    if (currentPage > 1) {
        currentPage--;
        getRepos(currentUsername, currentPage);
    }
};

const nextPage = () => {
    if (currentPage * reposPerPage < totalRepos) {
        currentPage++;
        getRepos(currentUsername, currentPage);
    }
};

const updatePaginationButtons = () => {
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage * reposPerPage >= totalRepos;
};
