document.addEventListener("DOMContentLoaded", function () {
  const LogoutAction = document.getElementById("logout-action");
  if (LogoutAction) {
    const FormLogout = document.createElement("form");
    FormLogout.setAttribute("action", "/auth/logout");
    FormLogout.setAttribute("method", "POST");
    FormLogout.setAttribute("id", "form-logout");
    document.body.appendChild(FormLogout);

    LogoutAction.addEventListener("click", event => {
      event.preventDefault();
      FormLogout.submit();
    });
  }
});
