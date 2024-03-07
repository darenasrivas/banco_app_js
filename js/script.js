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

 ///////// BOTÓN LOGIN /////////
  
  // Llamada a la API para obtener los datos del usuario.
  btnLogin.addEventListener("click", function (e) {
    e.preventDefault();
  
    // Obtener los valores de usuario y pin de los elementos del DOM
    const user = inputLoginUsername.value;
    const pin = inputLoginPin.value;
  
    // Constante welcome
    const welcomeSpan = document.querySelector(".welcome");
  
    // Realizar la solicitud HTTP a la API
    fetch(`${LOGIN_URL}?username=${user}&pin=${pin}`)
      .then((res) => {
        if (!res.ok) {
          inputLoginUsername.focus();
          throw new Error("Error en la llamada a la API");
        }
        return res.json();
      })
      .then((datos) => {
        // Suponiendo que setAccount() y setToken() son funciones definidas en otro lugar
        const movimientos = datos.account.movements.map((movimiento) => {
          return {
            ...movimiento,
            date: formatDate(movimiento.date),
          };
        });
        const address = datos.account.address;
        const numberAccount = datos.account.numberAccount;
        const nationalIdNumber = datos.account.nationalIdNumber;
        const interestRate = datos.account.interestRate;
  
        // Obtener el nombre de usuario del objeto de datos
        const username = datos.account.username;
  
        // Verificar si el nombre de usuario está en el mapeo
        if (username in userImageMapping) {
          // Obtener el nombre de archivo de imagen correspondiente al nombre de usuario
          const imageName = userImageMapping[username];
  
          // Construir la URL de la imagen basada en el nombre de archivo
          const userImageURL = `./images/${imageName}`;
  
          // Obtener el elemento con la clase user-image
          const userImageElement = document.querySelector(".user-image img");
  
          // Asignar la URL de la imagen del usuario a la fuente de la etiqueta img
          userImageElement.src = userImageURL;
        } else {
          console.error("No se encontró una imagen para el usuario:", username);
        }
  
        // Guardar las cuentas en la variable accounts
        accounts = datos.accounts;
  
        document.body.style.overflow = "scroll";
  
        ///////// FUNCIÓN DISPLAY ELEMNTOS /////////
  
        // Función para mostrar los movimientos actualizados en la lista
        function displayMovimientos() {
          // Obtener el elemento de la lista de movimientos
          const movementsList = document.querySelector(".movements__list");
  
          // Limpiar cualquier contenido previo en la lista
          movementsList.innerHTML = "";
  
          // Iterar sobre los movimientos y agregar cada uno como un elemento de la lista
          movimientos.forEach((movimiento) => {
            const listItem = document.createElement("li");
  
            // Determinar el tipo de movimiento (depósito o retiro)
            const movementType = movimiento.amount > 0 ? "deposit" : "withdrawal";
  
            // Asignar el texto y la clase correspondiente al tipo de movimiento al elemento de la lista
            listItem.textContent = `${movementType}: ${movimiento.date} / ${Math.abs(movimiento.amount)}€`;
            listItem.classList.add(
              "movements__type",
              `movements__type--${movementType}`,
              "mt-3"
            );
  
            // Agregar el elemento de la lista al contenedor de la lista
            movementsList.appendChild(listItem);
          });
        }
  
        ///////// LLAMAMOS A LA FUNCIÓN DISPLAY ELEMENTOS /////////
  
        displayMovimientos();
  
        // Obtener el formulario de solicitud de préstamo
        const loanForm = document.querySelector(".form--loan");
  
        loanForm.addEventListener("submit", function (e) {
          e.preventDefault(); // Evitar que el formulario se envíe automáticamente
  
          // Obtener el valor del monto del préstamo del campo de entrada
          const loanAmount = parseFloat(
            document.querySelector(".form__input--loan-amount").value
          );
  
          // Verificar si el monto es válido
          if (isNaN(loanAmount) || loanAmount <= 0) {
            alert("🙇🙇🙇 Please enter a valid loan amount. 🙇🙇🙇"); // Mostrar una alerta si el monto no es válido
            return; // Salir de la función
          }
  
          // Crear un objeto con los detalles del movimiento
          const movementData = {
            amount: loanAmount,
            date: new Date().toISOString(), // Obtener la fecha actual en el formato ISO
          };
  
          // Realizar la solicitud HTTP POST al servidor
          fetch(`${SERVER_URL}/movements?token=${token}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(movementData),
          })
            .then((response) => response.json())
            .then((data) => {
              // Aquí puedes manejar la respuesta del servidor si lo deseas
              console.log(data);
  
              // Calcular el nuevo saldo sumando el monto del préstamo al saldo actual
              const newBalance = totalMovimientos + loanAmount;
  
              // Actualizar el balance en el elemento HTML
              balanceValueElement.textContent = `${newBalance}€`;
  
              // Actualizar el balance en el elemento HTML
              balanceValueElement.textContent = `${newBalance}€`;
  
              // Recalcular el total de ingresos
              const totalIngresosActualizado = totalIngresos + loanAmount;
  
              // Actualizar el total de ingresos en el resumen
              balanceInElement.textContent = `${totalIngresosActualizado}€`;
  
              // Mostrar un mensaje de éxito
              alert(`💰💰💰 Successfully deposited ${loanAmount}€ 💰💰💰`);
  
              // Calcular la suma de los valores de los movimientos después del depósito
              const totalMovimientosDespuesDeposito = movimientos.reduce(
                (total, movimiento) => {
                  return total + movimiento.amount;
                },
                0
              );
  
              // Actualizar el total de ingresos sumando los montos de los movimientos que sean ingresos
              const nuevosIngresos = movimientos
                .filter((movimiento) => movimiento.amount > 0)
                .reduce((total, movimiento) => total + movimiento.amount, 0);
  
              // Mostrar el total de ingresos en el resumen
              balanceInElement.textContent = `${nuevosIngresos}€`;
  
              // Mostrar el total de los movimientos después del depósito en el balance
              balanceValueElement.textContent = `${totalMovimientosDespuesDeposito}€`;
            })
            .catch((error) => {
              console.error("Error:", error);
            });
  
          // Obtener la fecha actual
          const currentDate = new Date();
  
          // Obtener los componentes de la fecha actual
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");
  
          // Formatear la fecha en el formato deseado (año-mes-día)
          const formattedDate = `${year}-${month}-${day}`;
  
          // Crear un objeto de movimiento para el depósito
          const depositMovement = {
            date: formattedDate,
            amount: loanAmount,
          };
  
          // Agregar el movimiento de depósito al principio de la lista de movimientos
          movimientos.unshift(depositMovement);
  
          // Mostrar los movimientos actualizados en la lista
          displayMovimientos();
  
          // Limpiar el campo de entrada del monto del préstamo
          document.querySelector(".form__input--loan-amount").value = "";
        });
  
        setAccount(datos.account);
        setToken(datos.token);
        console.log(movimientos);
        console.log(address);
        console.log(numberAccount);
        console.log(nationalIdNumber);
        console.log(interestRate);
        console.log(datos);
  
        // Actualizar el saludo en el h1 después de iniciar sesión
        const emojiHand = String.fromCodePoint(0x1f44b);
        const ownerName = datos.account.owner;
        const nombrePila = ownerName.split(" ")[0];
        welcomeSpan.textContent =
          `${emojiHand}  ` + " Welcome to your imaginary account " + nombrePila;
  
        // Oculta la sección de login
        // Oculta gradualmente la sección de login después de la autenticación exitosa
        const loginSection = document.querySelector(".container");
        loginSection.classList.add("fade-out");
  
        // Calcular la suma de los valores de los movimientos
        const totalMovimientos = movimientos.reduce((total, movimiento) => {
          return total + movimiento.amount;
        }, 0);
  
        // Mostrar el total de los movimientos en el balance
        const balanceValueElement = document.querySelector(".balance__value");
        balanceValueElement.textContent = `${totalMovimientos}€`;
  
        // Filtrar los movimientos por tipo: ingresos (positivos) y egresos (negativos)
        const ingresos = movimientos.filter(
          (movimiento) => movimiento.amount > 0
        );
        const egresos = movimientos.filter((movimiento) => movimiento.amount < 0);
  
        // Calcular la suma de los valores de los movimientos de ingresos y egresos
        const totalIngresos = ingresos.reduce(
          (total, movimiento) => total + movimiento.amount,
          0
        );
        const totalEgresos = Math.abs(
          egresos.reduce((total, movimiento) => total + movimiento.amount, 0)
        ); // Tomamos el valor absoluto de la suma de egresos
  
        // Mostrar los totales e interes en sus respectivas secciones del resumen
        const balanceInElement = document.querySelector(".summary__value--in");
        const balanceOutElement = document.querySelector(".summary__value--out");
        const interestRateElement = document.querySelector(
          ".summary__value--interest"
        );
        const addressElement = document.querySelector(".summary__value--address");
        const nationalIdNumberElement = document.querySelector(
          ".summary__value--nationalIdNumber"
        );
        const numberAccountElement = document.querySelector(
          ".summary__value--numberAccount"
        );
        const ownerNameElement = document.querySelector(".summary__value--owner");
  
        balanceInElement.textContent = `${totalIngresos}€`;
        balanceOutElement.textContent = `${totalEgresos}€`;
        interestRateElement.textContent = `${interestRate}%`;
        addressElement.textContent = `${address}`;
        nationalIdNumberElement.textContent = `${nationalIdNumber}`;
        numberAccountElement.textContent = `${numberAccount}`;
        ownerNameElement.textContent = `${ownerName}`;
  
        // Después de 2 segundos, oculta completamente la sección
        setTimeout(() => {
          loginSection.style.display = "none";
        }, 2000);
  
        // Mostrar el main al hacer login
        const mainSection = document.querySelector(".app");
        mainSection.style.opacity = 1;
      })
  
      // Dentro del bloque catch
      .catch((error) => {
        console.error(error, "Error al hacer login");
        // Eliminar el mensaje de error existente, si lo hay
        const existingError = document.querySelector(".card-title-error");
        // Modificar el texto del título del formulario de login para mostrar el error
        loginTitle.textContent = "Login Error, please try again";
        loginTitle.classList.add("text-danger"); // Agregar clase para estilo rojo
        loginTitle.classList.add("card-title-error"); // Agregar clase para identificar el mensaje de error
      });
  });


  ///////// FUNCIÓN DISPLAY MOVIMIENTOS /////////
  
  // Definición de la variable `movimientos`
  let movimientos = []; // Inicializamos movimientos como un array vacío
  
  // Función para mostrar los movimientos actualizados en la lista
  function displayMovimientos() {
    // Obtener el elemento de la lista de movimientos
    const movementsList = document.querySelector(".movements__list");
  
    // Limpiar cualquier contenido previo en la lista
    movementsList.innerHTML = "";
  
    // Iterar sobre los movimientos y agregar cada uno como un elemento de la lista
    movimientos.forEach((movimiento) => {
      const listItem = document.createElement("li");
  
      // Determinar el tipo de movimiento (depósito o retiro)
      const movementType = movimiento.amount > 0 ? "deposit" : "withdrawal";
  
      // Asignar el texto y la clase correspondiente al tipo de movimiento al elemento de la lista
      listItem.textContent = `${movementType}: ${movimiento.date} / ${Math.abs(movimiento.amount)}€`;
      listItem.classList.add(
        "movements__type",
        `movements__type--${movementType}`,
        "mt-3"
      );
  
      // Agregar el elemento de la lista al contenedor de la lista
      movementsList.appendChild(listItem);
    });
  }


  ///////// BOTÓN TRANSFERENCIA - HACER LA TRANSFERNCIA /////////
  
  // Obtener referencia a los elementos del formulario de transferencia
  const transferForm = document.querySelector(".form--transfer");
  const toInput = document.querySelector(".form__input--to");
  const amountInput = document.querySelector(".form__input--amount");
  const transferBtn = document.querySelector(".form__btn--transfer");
  
  // Agregar un evento de clic al botón de transferencia
  transferBtn.addEventListener("click", function (e) {
    e.preventDefault();
  
    // Obtener los valores de la cuenta de destino y la cantidad a transferir
    const destinationAccount = toInput.value;
    const amount = parseFloat(amountInput.value);
  
    // Obtener el saldo actual del balance
    const balanceValueElement = document.querySelector(".balance__value");
    const currentBalance = parseFloat(balanceValueElement.textContent);
  
    // Verificar si la cantidad es válida
    if (isNaN(amount) || amount <= 0) {
      alert("🙅🙅🙅 Please enter a valid amount to transfer. 🙅🙅🙅");
      return;
    }
  
    // Verificar si el monto de la transferencia es mayor que el saldo disponible
    if (amount > currentBalance) {
      alert("💸💸💸 Transfer amount exceeds available balance. 💸💸💸");
      return;
    }
  
    // Verificar si la cuenta de destino es válida o no existe
    if (!destinationAccount) {
      alert("��� Please enter a valid destination account. ���");
      return;
    }
  
    // Realizar la solicitud HTTP POST al servidor para la transferencia
    fetch(`${SERVER_URL}/transfer?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destinationAccount, amount }),
    })
      .then((response) => response.json())
      .then((data) => {
  
        // Aquí puedes manejar la respuesta del servidor si lo deseas
        console.log(data)
  
        alert(data.message); // Muestra un mensaje de éxito o fallo
  
        // Actualizar la cantidad del balance en el DOM
        const balanceValueElement = document.querySelector(".balance__value");
        const currentBalance = parseFloat(balanceValueElement.textContent);
        const newBalance = currentBalance - amount;
        balanceValueElement.textContent = `${newBalance}€`;
  
        // Actualizar la cantidad total de egresos en el resumen en el DOM
        const balanceOutElement = document.querySelector(".summary__value--out");
        const currentOut = parseFloat(balanceOutElement.textContent);
        const newOut = currentOut + amount;
        balanceOutElement.textContent = `${newOut}€`;
  
        // Crear un nuevo elemento li para representar el nuevo movimiento
        const newMovement = document.createElement("li");
  
        // Determinar el tipo de movimiento (depósito o retiro)
        const movementType = amount > 0 ? "withdrawal" : "deposit";
  
        // Agregar las clases CSS correspondientes al tipo de movimiento al elemento li
        newMovement.classList.add(
          "movements__type",
          `movements__type--${movementType}`,
          "mt-3"
        );
  
        // Agregar el contenido del nuevo movimiento al elemento li
        newMovement.textContent = `${movementType}: ${formatDate(new Date())} / ${Math.abs(amount)}€`;
  
        // Obtener la lista de movimientos
        const movementsList = document.querySelector(".movements__list");
  
        // Insertar el nuevo elemento li al principio de la lista de movimientos
        movementsList.insertBefore(newMovement, movementsList.firstChild);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while processing the transfer."); // Muestra un mensaje de error si hay un problema
      });
  
    // Limpiar los campos del formulario después de la transferencia
    toInput.value = "";
    amountInput.value = "";
  });
  