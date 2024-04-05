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

const registerForm = document.getElementById("register_form");

if (registerForm) {
  /**
   * Event listener for the submit event on the register form.
   * It prevents the default form submission behavior, retrieves the form data,
   * converts it into an object, and sends it to the server using a POST request.
   * If the request is successful (status code 200), it redirects the user to the login page.
   * Otherwise, it redirects the user to the register-fail page.
   * If an error occurs during the request, it logs the error to the console and redirects the user to the register-fail page.
   *
   * @param {Event} event - The submit event object.
   * @returns {void}
   */
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(registerForm);
    const formObject = {};
    for (const [key, value] of data) {
      formObject[key] = value;
    }
    try {
      result = await fetch("/api/sessions/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (result.ok) {
        window.location.href = "/login";
      } else {
        window.location.href = "/register-fail";
      }
    } catch (error) {
      console.log(error);
      window.location.href = "/register-fail";
    }
  });
}
