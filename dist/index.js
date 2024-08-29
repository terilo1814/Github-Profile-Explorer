"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    return response.json();
}
// Display user card UI
const showResultUI = (singleUser) => {
    const { avatar_url, login, url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'> 
    <img src=${avatar_url} alt=${login} />
    <hr />
    <div class="card-footer">
      <img src="${avatar_url}" alt="${login}" /> 
      <a href="${url}" class='link'> Github </a>
    </div>
    </div>`);
};
// Fetch user data initially
async function fetchUserData(url) {
    try {
        const userInfo = await myCustomFetcher(url, {});
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
        }
    }
    catch (error) {
        console.error('Error fetching user data:', error);
    }
}
// Default fetch call
fetchUserData("https://api.github.com/users");
// Perform search when form is submitted
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.trim().toLowerCase();
    // Clear previous results
    main_container.innerHTML = '';
    if (searchTerm === '') {
        main_container.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        return;
    }
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => user.login.toLowerCase().includes(searchTerm));
        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.error('Error searching for users:', error);
    }
});
