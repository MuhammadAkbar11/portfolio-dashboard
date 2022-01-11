const ProjectDeleteModal = document.getElementById("modalDeleteProject");

const initializeProjectModals = () => {
  initModalDelete();
};

const initModalDelete = () => {
  // if(ProjectModalDelete)

  const ToggleProjectDeleteModal = [].slice.call(
    document.querySelectorAll("#action-delete-project")
  );

  ToggleProjectDeleteModal.forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.preventDefault();
      console.log(e.target.dataset);
      const title = e.target.dataset.title;
      const projectId = e.target.dataset.projectid;
      handleShowDeleteProjectModal({ title, projectId });
    });
  });
};

const handleShowDeleteProjectModal = data => {
  console.log(data);
  if (ProjectDeleteModal) {
    const ModalDeleteBody = ProjectDeleteModal.querySelector(".modal-body");
    const ModalDeleteForm = ProjectDeleteModal.querySelector(
      "#modalDeleteProjectForm"
    );

    const formDeleteAction = `/projects/${data.projectId}`;
    ModalDeleteForm.setAttribute("action", formDeleteAction);

    ModalDeleteBody.innerHTML = `
    <p>Are your sure want to delete this <span class="text-danger fw-bold" >${data.title}</span> project? <br> you can't undo this action </p>
    `;

    // const ModalDeleteConfirm = ProjectDeleteModal.querySelector(".action-confirm");
    // const FormDelete = document.createElement("form");

    const modalEl = new bootstrap.Modal(
      document.getElementById("modalDeleteProject"),
      {
        keyboard: false,
      }
    );

    modalEl.show();

    ProjectDeleteModal.addEventListener("shown.bs.modal", function (event) {
      console.log("shown");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => initializeProjectModals());
