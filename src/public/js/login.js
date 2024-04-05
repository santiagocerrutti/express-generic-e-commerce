/* eslint-disable no-undef */
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const type = document.getElementById("message.type")?.getAttribute("value");
const text = document.getElementById("message.text")?.getAttribute("value");

if (type && text) {
  Toast.fire({
    icon: type, // success | error | warning | info | question
    title: text,
  });
}

const loginForm = document.getElementById("login_form");

if (loginForm) {
  /**
   * This function is an event listener for the submit event on the login form.
   * It prevents the default form submission behavior, retrieves the form data,
   * converts it into an object, and sends a POST request to the "/api/sessions/login" endpoint.
   * If the request is successful (status code 200), it redirects the user to the "/products" page.
   * Otherwise, it redirects the user to the "/login-fail" page.
   * If an error occurs during the request, it logs the error to the console and redirects the user to the "/login-fail" page.
   *
   * @param {Event} event - The submit event object.
   * @returns {void}
   */
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(loginForm);
    const formObject = {};
    for (const [key, value] of data) {
      formObject[key] = value;
    }
    try {
      const result = await fetch("/api/sessions/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (result.ok) {
        window.location.href = "/products";
      } else {
        window.location.href = "/login-fail";
      }
    } catch (e) {
      console.log(e);
      window.location.href = "/login-fail";
    }
  });
}
