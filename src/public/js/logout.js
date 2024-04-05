const logoutForm = document.getElementById("logout_form");

if (logoutForm) {
  /**
   * This function is an event listener for the submit event on the logout form.
   * It prevents the default form submission behavior, retrieves form data, and sends a POST request to the "/api/sessions/logout" endpoint.
   * If the request is successful, it redirects the user to the "/logout" page.
   * If an error occurs, it logs the error to the console.
   *
   * @param {Event} event - The submit event object.
   * @returns {Promise<void>} - A promise that resolves when the function completes.
   */
  logoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(logoutForm);
    const formObject = {};
    for (const [key, value] of data) {
      formObject[key] = value;
    }
    try {
      await fetch("/api/sessions/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      window.location.href = "/logout";
    } catch (e) {
      console.log(e);
    }
  });
}
