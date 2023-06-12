const logoutForm = document.getElementById("logout_form");

if (logoutForm) {
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
