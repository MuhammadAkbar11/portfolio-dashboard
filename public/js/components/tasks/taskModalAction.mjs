import {
  createInputInvalidFeedback,
  removeInputInvalidFeedback,
} from "../alert.js";
import { socketCreateProjectTasks } from "@socket/tasks.mjs";
import { showModalDelete } from "@components/modals.mjs";
import {
  socketDeleteProjectTasks,
  socketUpdateProjectTasks,
} from "../../socket/tasks.mjs";
import { taskBoardRemoveItem, taskBoardScroll } from "./taskBoards.mjs";

export function projectTaskModalAction(El) {
  const ProjectTaskForm = El.querySelector("#project-task-form");

  const projectId = ProjectTaskForm.querySelector("[name=projectId]");
  const taskId = ProjectTaskForm.querySelector("[name=taskId]");
  const status = ProjectTaskForm.querySelector("[name=status]");
  const note = ProjectTaskForm.querySelector("[name=note]");
  const method = ProjectTaskForm.querySelector("[name=_method]");

  removeInputInvalidFeedback(note);

  ProjectTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (note.value.trim() == "") {
      createInputInvalidFeedback(note, "Note is required");
    } else {
      if (method.value == "PUT") {
        socketUpdateProjectTasks(
          {
            taskId: taskId.value,
            note: note.value,
            status: status.value,
            projectId: projectId.value,
            room: `project:${projectId.value}`.trim(),
          },
          (err, data) => {
            console.log(err, data, "update");
            if (err) {
              console.log(err);
              return;
            }
            El.querySelector("[data-bs-dismiss=modal]").click();
          }
        );
      } else {
        socketCreateProjectTasks(
          {
            note: note.value,
            status: status.value,
            projectId: projectId.value,
            room: `project:${projectId.value}`.trim(),
          },
          (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            El.querySelector("[data-bs-dismiss=modal]").click();
          }
        );
      }
    }
  });
}

export function createProjectTaskEditModal(event) {
  event.preventDefault();
  const target = event.target;
  const task = JSON.parse(target.dataset.task);
  const FormProjectTaskModal = document.getElementById("formTaskModal");
  const ModalTitle = FormProjectTaskModal.querySelector(".modal-title");
  const ModalBody = FormProjectTaskModal.querySelector(".modal-body");
  const FormModal = ModalBody.querySelector("#project-task-form");

  FormModal.setAttribute("action", "/tasks/" + task._id);
  FormModal.querySelector("[name=_method]").value = "PUT";
  FormModal.querySelector("[name=note]").value = task.note;
  FormModal.querySelector("[name=taskId]").value = task._id;
  const TaskStatusInput = FormModal.querySelector("[name=status]");

  [].slice.call(TaskStatusInput.querySelectorAll("option")).map(op => {
    op.removeAttribute("selected");
    console.log(op.value, task.status.trim());
    if (op.value.trim() == task.status.trim())
      op.setAttribute("selected", true);
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
}

export function resetProjectTaskActionModal(modalEl) {
  const ModalTitle = modalEl.querySelector(".modal-title");
  const ModalBody = modalEl.querySelector(".modal-body");
  const FormModal = ModalBody.querySelector("#project-task-form");

  FormModal.setAttribute("action", "/tasks/");
  FormModal.querySelector("[name=_method]").value = "POST";
  FormModal.querySelector("[name=note]").value = "";
  FormModal.querySelector("[name=taskId]").value = "";

  const TaskStatusInput = FormModal.querySelector("[name=status]");

  [].slice.call(TaskStatusInput.querySelectorAll("option")).map((op, i) => {
    op.removeAttribute("selected");
    if (i == 0) op.setAttribute("selected", true);
  });

  ModalTitle.innerText = "Create Task";
  modalEl.classList.add("fade");
}

export function showProjectTaskDeleteModal(e) {
  e.preventDefault();
  const ModalDelete = document.getElementById("modalDeleteTask");
  const FormDelete = ModalDelete.querySelector("#modalDeleteTaskForm");
  const target = e.target;
  const dataTask = JSON.parse(target.dataset.task);

  FormDelete.querySelector("[name=taskId]").value = dataTask._id;

  const modalBody = `<p>Are your sure want to delete <span class="text-danger fw-bold" >${dataTask.note}</span> note? <br> you can't undo this action </p>`;

  showModalDelete(
    document.getElementById("modalDeleteTask"),
    `/tasks/${dataTask._id}`,
    "Delete Task",
    modalBody
  );
}

export function projectTaskDeleteModalShowHandler(El) {
  const FormDelete = El.querySelector("#modalDeleteTaskForm");
  const DismisModal = El.querySelector("[data-bs-dismiss=modal]");
  FormDelete.addEventListener("submit", function (event) {
    event.preventDefault();
    const projectId = event.target.querySelector("[name=projectId]");
    const taskId = event.target.querySelector("[name=taskId]");
    const selectedTask = [].slice
      .call(document.querySelectorAll("#tasks-backlog"))
      .filter(x => x.dataset.key == taskId.value);

    socketDeleteProjectTasks(
      { projectId: projectId.value, taskId: taskId.value },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        taskBoardRemoveItem(selectedTask[0]);
        taskBoardScroll();
        DismisModal.click();
      }
    );
  });
}
