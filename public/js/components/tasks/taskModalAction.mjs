import {
  createInputInvalidFeedback,
  removeInputInvalidFeedback,
} from "../alert.js";
import { socketCreateProjectTasks } from "@socket/tasks.mjs";

export function projectTaskModalAction(eventModal) {
  const Modal = bootstrap.Modal.getInstance(eventModal.target);
  const ProjectTaskForm = eventModal.target.querySelector("#project-task-form");

  const { note, status, projectId, method, taskId } =
    taskFormInputs(ProjectTaskForm);

  removeInputInvalidFeedback(note);

  ProjectTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (note.value.trim() == "") {
      createInputInvalidFeedback(note, "Note is required");
    } else {
      if (method.value == "PUT") {
        console.log("Edit Here");
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
            Modal.hide();
          }
        );
      }
    }
  });
}

export function taskFormInputs(form) {
  const projectId = form.querySelector("[name=projectId]");
  const status = form.querySelector("[name=status]");
  const note = form.querySelector("[name=note]");
  const method = form.querySelector("[name=_method]");
  const taskId = form.querySelector("[name=taskId]");
  const submit = form.querySelector("[type=submit]");

  return { projectId, taskId, note, status, method, submit };
}

export function createProjectTaskEditModal(task) {
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
}

export function resetProjectTaskActionModal(modalEl) {
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
}
