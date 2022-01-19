export function createInputInvalidFeedback(el, message) {
  const Feeback = document.createElement("small");
  Feeback.className = "text-danger invalid-feedback";
  Feeback.textContent = message;
  el.classList.add("is-invalid");
  el.parentNode.appendChild(Feeback);
}

export function removeInputInvalidFeedback(el) {
  const elParent = el.parentNode;
  const Feedback = elParent.querySelector(".invalid-feedback");
  el.classList.remove("is-invalid");
  if (Feedback) {
    el.parentNode.removeChild(Feedback);
  }
}
