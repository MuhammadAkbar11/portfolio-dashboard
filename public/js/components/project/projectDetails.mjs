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
import { socketUpdateProjectTasks } from "../../socket/tasks.mjs";
import socket from "@socket/index.mjs";

function initProjectTasks() {
  const ProjectTaskContainer = document.getElementById("tasks-container");
  if (ProjectTaskContainer) {
    const projectID = ProjectTaskContainer.dataset.projectid;
    socket.emit("join", `project:${projectID}`.trim());
    socketLoadProjectTasks(projectID, (err, data) => {
      boardsUI(data);
    });
  }
}

function projectDetails() {
  projectTask();
}

const projectTask = () => {
  const ProjectTaskFormModal = document.getElementById("formTaskModal");
  const ProjectTaskDeleteModal = document.getElementById("modalDeleteTask");

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

  const ProjectMoveTaskActions = [].slice.call(
    document.querySelectorAll("#task-move")
  );

  ProjectDeleteTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");
    x.addEventListener("click", showProjectTaskDeleteModal);
  });

  ProjectEditTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");
    x.addEventListener("click", createProjectTaskEditModal);
  });

  ProjectMoveTaskActions.forEach(x => {
    x.setAttribute("href", "javascript:void(0)");

    x.addEventListener("click", movingTask);
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

  projectTaskActions();
  taskBoardScroll();
}

function movingTask(event) {
  // const { task, destination } = event.target.dataset;
  // const
  let task = null;
  let destination = null;

  if (event.target?.task) {
    task = event.target.dataset?.task;
    destination = event.target.dataset?.destination;
  } else if (event.target.parentNode.dataset?.task) {
    task = event.target.parentNode.dataset?.task;
    destination = event.target.parentNode.dataset?.destination;
  } else if (event.target.parentNode.parentNode.dataset?.task) {
    task = event.target.parentNode.parentNode.dataset?.task;
    destination = event.target.parentNode.parentNode.dataset?.destination;
  }

  if (task) {
    const parseTask = JSON.parse(task);
    socketUpdateProjectTasks(
      {
        taskId: parseTask._id,
        note: parseTask.note,
        status: destination,
        projectId: parseTask.project,
        room: `project:${parseTask.project}`.trim(),
      },
      (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  }
}

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
  projectTaskActions();
});

socket.on("updated-project-task", data => {
  updateTaskCardUI(data.task);
  projectTaskActions();
});

socket.on("moved-project-task", data => {
  const toBoard = data.to.toLocaleLowerCase();
  const selectedToBoard = getBoard(toBoard);

  moveBoardItem(selectedToBoard, data.task, data.beforeTask, data.nextTask);
  projectTaskActions();
});

document.addEventListener("DOMContentLoaded", () => initProjectTasks());

projectDetails();
