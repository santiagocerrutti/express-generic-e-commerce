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

const newPasswordForm = document.getElementById("new_password_form");
const inputPassword1 = document.getElementById("password_input");
const inputPassword2 = document.getElementById("password_input_2");
const token = document.getElementById("token")?.getAttribute("value");

if (inputPassword1 && inputPassword2 && newPasswordForm && token) {
  newPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (inputPassword1.value === inputPassword2.value) {
      const data = new FormData(newPasswordForm);
      const formObject = {};
      for (const [key, value] of data) {
        formObject[key] = value;
      }
      try {
        const result = await fetch(`/api/sessions/new-password/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        });

        const resultJson = await result.json();

        if (result.ok) {
          window.location.href = "/new-password-success";
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
          title: e.message,
        });
      }
    } else {
      Toast.fire({
        icon: "error", // success | error | warning | info | question
        title: "Password doesnot match",
      });
    }
  });
}
