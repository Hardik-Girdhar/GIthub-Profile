const APIURL = "https://api.github.com/users/";
const main = document.querySelector("#main");
const searchBox = document.querySelector("#search");

const getUser = async (username) => {
    try {
        const response = await fetch(APIURL + username);
        if (!response.ok) {
            throw new Error('User not found');
        }
        const data = await response.json();
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
                </div>
            </div>
        `;
        main.innerHTML = card;
        getRepos(username);
    } catch (error) {
        main.innerHTML = `<p class="error">${error.message}</p>`;
    }
};

const getRepos = async (username) => {
    try {
        const repos = document.querySelector("#repos");
        const response = await fetch(APIURL + username + "/repos");
        if (!response.ok) {
            throw new Error('Unable to fetch repositories');
        }
        const data = await response.json();
        repos.innerHTML = "";  // Clear previous repositories
        data.slice(0, 3).forEach((item) => {
            const elem = document.createElement("a");
            elem.classList.add("repo");
            elem.href = item.html_url;
            elem.innerText = item.name;
            elem.target = "_blank";
            repos.appendChild(elem);
        });
    } catch (error) {
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
