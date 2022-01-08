document.addEventListener("DOMContentLoaded", function () {
  const logoutAction = document.getElementById("logout-action");
  if (logoutAction) {
    const formLogout = document.createElement("form");
    formLogout.setAttribute("action", "/auth/logout");
    formLogout.setAttribute("method", "POST");
    formLogout.setAttribute("id", "form-logout");
    document.body.appendChild(formLogout);

    logoutAction.addEventListener("click", event => {
      event.preventDefault();
      console.log(event.target);
      formLogout.submit();
    });
  }
});
