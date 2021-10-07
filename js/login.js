import displayMessage from "./components/displayMessage.js";
import { saveToken, saveUser } from "./utils/storage.js";
import { baseUrl } from "./settings/api.js";
import createMenu from "./components/createMenu.js";

const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const message = document.querySelector(".message-container");

createMenu();

form.addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();

    message.innerHTML = "";

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue.length === 0 || passwordValue.length === 0) {
        return displayMessage("alert-warning", "Please enter valid login details", ".message-container");
    }

    doLogin(emailValue, passwordValue);
}

async function doLogin(email, password) {
    const url = baseUrl + "auth/local";

    const data = JSON.stringify({ identifier: email, password: password });

    const options = {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();

        if (json.user) {

            saveToken(json.jwt);
            saveUser(json.user);

           location.href = "/profile.html";
        }

        if (json.error) {
            displayMessage("alert-danger", "Wrong email address or password", ".message-container");
        }
    } catch (error) {
        console.log(error);
    }
}