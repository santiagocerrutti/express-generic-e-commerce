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

const resetPasswordForm = document.getElementById("reset_password_form");
const emailInput = document.getElementById("email_input");

/**
 * This function is an event listener for the submit event of the resetPasswordForm element.
 * It prevents the default form submission behavior, retrieves form data, sends a POST request to the "/api/sessions/reset-password-request" endpoint,
 * and handles the response accordingly.
 *
 * @param {Event} event - The submit event object.
 * @returns {Promise<void>} - A promise that resolves once the function execution is complete.
 */
if (emailInput && resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(resetPasswordForm);
    const formObject = {};
    for (const [key, value] of data) {
      formObject[key] = value;
    }
    try {
      const result = await fetch("/api/sessions/reset-password-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const resultJson = await result.json();

      if (result.ok) {
        Toast.fire({
          icon: "success", // success | error | warning | info | question
          title: `An email will be sent to ${emailInput.value} in case it is registered.`,
        });
      } else {
        Toast.fire({
          icon: "error", // success | error | warning | info | question
          title: resultJson.error,
        });
      }
    } catch (e) {
      console.log(e);
      Toast.fire({
        icon: "error", // success | error | warning | info | question
        title: "Internal Server Error. Try again later.",
      });
    }
  });
}
