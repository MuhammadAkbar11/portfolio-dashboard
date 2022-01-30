function changePassword() {
  const CheckShowChangePassword = document.getElementById("showChangePassword");
  let show = false;
  if (CheckShowChangePassword) {
    CheckShowChangePassword.addEventListener("change", event => {
      if (event.target.checked) {
        showPasswordInputsValue("text");
      } else {
        showPasswordInputsValue("password");
      }
    });
  }
}

function showPasswordInputsValue(type) {
  const InputsTypePassword = [].slice.call(
    document.querySelectorAll(".change-pw-input")
  );

  InputsTypePassword.map(input => {
    input.setAttribute("type", type);
  });
}

changePassword();
