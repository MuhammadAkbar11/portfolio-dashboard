const ProjectDeleteModal = document.getElementById("modalDeleteProject");

const initializeProjectModals = () => {
  initModalDelete();
  initProjectTaskActionModal();
};

const initModalDelete = () => {
  // if(ProjectModalDelete)

  const ToggleProjectDeleteModal = [].slice.call(
    document.querySelectorAll("#action-delete-project")
  );

  ToggleProjectDeleteModal.forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.preventDefault();

      const title = e.target.dataset.title;
      const projectId = e.target.dataset.projectid;
      handleShowDeleteProjectModal({ title, projectId });
    });
  });
};

const handleShowDeleteProjectModal = data => {
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

const initProjectTaskActionModal = () => {
  const FormProjectTaskModal = document.getElementById("formTaskModal");
  const ProjectEditTaskActions = [].slice.call(
    document.querySelectorAll("#task-edit")
  );

  if (FormProjectTaskModal) {
    const isErr = FormProjectTaskModal.dataset.error;
    if (isErr == "true") {
      FormProjectTaskModal.classList.remove("fade");
      const modalEl = new bootstrap.Modal(
        document.getElementById("formTaskModal"),
        {
          keyboard: false,
        }
      );
      modalEl.show();
    }

    FormProjectTaskModal.addEventListener("hidden.bs.modal", function (event) {
      ResetProjectTaskEditModal(event.target);
    });
  }

  ProjectEditTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");

    x.addEventListener("click", e => {
      e.preventDefault();
      const target = e.target;
      const dataTask = JSON.parse(e.target.dataset.task);
      CreateProjectTaskEditModal(dataTask);
    });
  });
};

const CreateProjectTaskEditModal = task => {
  const FormProjectTaskModal = document.getElementById("formTaskModal");
  const ModalTitle = FormProjectTaskModal.querySelector(".modal-title");
  const ModalBody = FormProjectTaskModal.querySelector(".modal-body");
  const FormModal = ModalBody.querySelector("#project-task-form");

  FormModal.setAttribute("action", "/tasks/" + task._id);
  FormModal.querySelector("[name=_method]").value = "PUT";
  FormModal.querySelector("[name=note]").value = task.note;
  const TaskStatusInput = FormModal.querySelector("[name=status]");

  [].slice.call(TaskStatusInput.querySelectorAll("option")).map(op => {
    op.removeAttribute("selected");
    if (op.value == task.status) op.setAttribute("selected", true);
  });

  ModalTitle.innerText = "Edit Task";
  FormProjectTaskModal.classList.add("fade");
  const modalEl = new bootstrap.Modal(
    document.getElementById("formTaskModal"),
    {
      keyboard: false,
      backdrop: true,
    }
  );
  modalEl.show();
};

const ResetProjectTaskEditModal = modalEl => {
  const ModalTitle = modalEl.querySelector(".modal-title");
  const ModalBody = modalEl.querySelector(".modal-body");
  const FormModal = ModalBody.querySelector("#project-task-form");

  FormModal.setAttribute("action", "/tasks/");
  FormModal.querySelector("[name=_method]").value = "POST";
  FormModal.querySelector("[name=note]").value = "";
  const TaskStatusInput = FormModal.querySelector("[name=status]");

  [].slice.call(TaskStatusInput.querySelectorAll("option")).map((op, i) => {
    op.removeAttribute("selected");
    if (i == 0) op.setAttribute("selected", true);
  });

  ModalTitle.innerText = "Create Task";
  modalEl.classList.add("fade");
  //   const modalEl = new bootstrap.Modal(
  //     document.getElementById("formTaskModal"),
  //     {
  //       keyboard: false,
  //     }
  //   );
  //   modalEl.show();
};

document.addEventListener("DOMContentLoaded", () => initializeProjectModals());
