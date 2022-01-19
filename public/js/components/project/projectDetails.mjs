import { showModalDelete } from "@components/modals.mjs";
import { io } from "socket.io-client";
import {
  boardsHandleIU,
  taskBoardScroll,
} from "@components/tasks/taskBoards.mjs";
import {
  createProjectTaskEditModal,
  projectTaskModalAction,
  resetProjectTaskActionModal,
} from "@components/tasks/taskModalAction.mjs";
import { socketLoadProjectTasks } from "@socket/tasks.mjs";
import { socketRoom } from "@socket/index.mjs";

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

  if (ProjectTaskContainer) {
    const projectID = ProjectTaskContainer.dataset.projectid;
    socketRoom(`project:${projectID}`.trim());
    socketLoadProjectTasks(projectID, (err, data) => {
      boardsUI(data);
    });
  }

  if (ProjectTaskFormModal) {
    ProjectTaskFormModal.addEventListener(
      "show.bs.modal",
      projectTaskModalAction
    );

    ProjectTaskFormModal.addEventListener("hidden.bs.modal", function (event) {
      resetProjectTaskActionModal(event.target);
    });
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
    x.addEventListener("click", deleteProjectTask);
  });

  ProjectEditTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");
    x.addEventListener("click", e => {
      e.preventDefault();
      const target = e.target;
      const { task } = target.dataset;
      createProjectTaskEditModal(JSON.parse(task));
    });
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

socket.on("new-project-task", data => {
  const status = data?.task.status.toLocaleLowerCase();
  const ProjectTaskBoards = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  const selectedBoard = ProjectTaskBoards.filter(board => board.id == status);
  boardsHandleIU.add(selectedBoard[0], data.task);

  projectTaskActions();
});
