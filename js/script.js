///////// FADE IN - ELEMENTO LOGIN /////////

// Fade in del elemento login cuando carga la página.
window.onload = function () {
  let div = document.getElementById("miDiv");
  div.classList.add("fade-in");
};

///////// ELEMENTOS /////////

const SERVER_URL = "http://localhost:4000";
const LOGIN_URL = `${SERVER_URL}/login`;

const btnLogin = document.querySelector(".login__btn");
const btnClose = document.querySelector(".form__btn--close");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const loginTitle = document.querySelector(".card-title");
// Guarda el token del usuario.
let token;
// Objeto que mapea los nombres de usuario a los nombres de archivo de imagen.
const userImageMapping = {
  juan_s: "juan.jpg",
  javier_r: "javier.jpg",
  estefania_p: "estefania.jpg",
  maria_p: "maria.jpg",
};