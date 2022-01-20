const showModalDelete = (
  modalEl,
  action,
  title = "Delete",
  body = "Are you Sure?"
) => {
  const ModalForm = modalEl.querySelector("form");
  const ModalTitle = modalEl.querySelector(".modal-title");
  const ModalBody = modalEl.querySelector(".modal-body");

  ModalForm.setAttribute("action", action);
  ModalBody.innerHTML = body;
  ModalTitle.innerHTML = title;

  const blModal = new bootstrap.Modal(modalEl, {
    keyboard: false,
  });

  blModal.show();
};

export { showModalDelete };
