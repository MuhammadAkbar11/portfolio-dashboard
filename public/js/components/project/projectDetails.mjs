import { io } from "socket.io-client";
import {
  boardsHandleIU,
  taskBoardScroll,
  getBoard,
} from "@components/tasks/taskBoards.mjs";
import {
  projectTaskDeleteModalShowHandler,
  showProjectTaskDeleteModal,
  createProjectTaskEditModal,
  projectTaskModalAction,
  resetProjectTaskActionModal,
} from "@components/tasks/taskModalAction.mjs";
import { socketLoadProjectTasks } from "@socket/tasks.mjs";
import { moveBoardItem } from "../tasks/taskBoards.mjs";
import { updateTaskCardUI } from "../tasks/taskCard.mjs";

const socket = io();

socket.on("connect", () => {
  console.log("connect");
});

function projectDetails() {
  projectTask();
}

const projectTask = () => {
  const ProjectTaskContainer = document.getElementById("tasks-container");
  const ProjectTaskFormModal = document.getElementById("formTaskModal");
  const ProjectTaskDeleteModal = document.getElementById("modalDeleteTask");

  if (ProjectTaskContainer) {
    const projectID = ProjectTaskContainer.dataset.projectid;
    socket.emit("join", `project:${projectID}`.trim());
    socketLoadProjectTasks(projectID, (err, data) => {
      boardsUI(data);
    });
  }

  if (ProjectTaskFormModal) {
    ProjectTaskFormModal.addEventListener("hidden.bs.modal", function (event) {
      resetProjectTaskActionModal(event.target);
    });
    projectTaskModalAction(ProjectTaskFormModal);
  }

  if (ProjectTaskDeleteModal) {
    projectTaskDeleteModalShowHandler(ProjectTaskDeleteModal);
  }
};

function projectTaskActions() {
  const ProjectDeleteTaskActions = [].slice.call(
    document.querySelectorAll("#task-delete")
  );

  const ProjectEditTaskActions = [].slice.call(
    document.querySelectorAll("#task-edit")
  );

  ProjectDeleteTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");
    x.addEventListener("click", showProjectTaskDeleteModal);
  });

  ProjectEditTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");
    x.addEventListener("click", createProjectTaskEditModal);
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

document.addEventListener("DOMContentLoaded", () => projectDetails());

socket.on("new-project-task", data => {
  const status = data?.task.status.toLocaleLowerCase();
  const ProjectTaskBoards = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  const selectedBoard = ProjectTaskBoards.filter(board => board.id == status);
  boardsHandleIU.add(selectedBoard[0], data.task);

  projectTaskActions();
});

socket.on("update-project-task-count", data => {
  const status = data?.status.toLocaleLowerCase();
  const selectedBoard = getBoard(status);
  boardsHandleIU.updateBadge(selectedBoard, data.count);
});

socket.on("updated-project-task", data => {
  updateTaskCardUI(data.task);
  projectTaskActions();
});

socket.on("moved-project-task", data => {
  const toBoard = data.to.toLocaleLowerCase();
  const fromBoard = data.from.toLocaleLowerCase();
  const selectedToBoard = getBoard(toBoard);
  const selectedFromBoard = getBoard(fromBoard);

  moveBoardItem(selectedFromBoard, selectedToBoard, data.task, data.afterTask);
  projectTaskActions();
});
