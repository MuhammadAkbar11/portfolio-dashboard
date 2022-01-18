import { showModalDelete } from "../modals.mjs";
import { io } from "socket.io-client";
import { boardsHandleIU, taskBoardScroll } from "../tasks/taskBoards.mjs";

const socket = io();

socket.on("connect", () => {});

function projectDetails() {
  projectTask();
}

const projectTask = () => {
  const ProjectTaskContainer = document.getElementById("tasks-container");

  if (ProjectTaskContainer) {
    const projectID = ProjectTaskContainer.dataset.projectid;
    loadProjectTasks(projectID);
  }
};

function loadProjectTasks(projectId) {
  socket.emit("project-tasks", { projectId }, (data, err) => {
    if (err) {
      return;
    }
    boardsUI(data);
  });
}

function projectTaskActions() {
  const ProjectDeleteTaskActions = [].slice.call(
    document.querySelectorAll("#task-delete")
  );

  ProjectDeleteTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");

    x.addEventListener("click", deleteProjectTask);
  });
}

function boardsUI(tasks) {
  const ProjectTaskBoards = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  ProjectTaskBoards.forEach(br => {
    const id = br.id;
    boardsHandleIU[id]?.(br, tasks[id]);
  });

  taskBoardScroll();
  projectTaskActions();
}

const deleteProjectTask = e => {
  e.preventDefault();
  const target = e.target;
  const dataTask = JSON.parse(target.dataset.task);

  const modalBody = `<p>Are your sure want to delete this <span class="text-danger fw-bold" >${dataTask.note}</span> note? <br> you can't undo this action </p>`;

  showModalDelete(
    document.getElementById("modalDeleteTask"),
    `/tasks/${dataTask._id}`,
    "Delete Task",
    modalBody
  );
};

document.addEventListener("DOMContentLoaded", () => projectDetails());
