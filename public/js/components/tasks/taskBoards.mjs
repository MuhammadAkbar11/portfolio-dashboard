import { getTaskCard, taskCardUI } from "./taskCard.mjs";

export const boardsHandleIU = {
  todo: (el, tasks) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);
    BoardTitle.innerHTML = `<span class="badge board-badge bg-primary text-center me-1 rounded-circle">${tasks?.length}</span> Todo`;
    tasks.map(task => {
      const taskCard = taskCardUI(task);
      BoardBody.appendChild(taskCard);
    });
  },
  progress: (el, tasks) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);
    BoardTitle.innerHTML = `
    <span class="badge board-badge bg-warning h-auto me-1 rounded-circle">${tasks?.length}</span> In Progress`;
    tasks.map(task => {
      const taskCard = taskCardUI(task);
      BoardBody.appendChild(taskCard);
    });
  },
  done: (el, tasks) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);
    BoardTitle.innerHTML = `<span class="badge board-badge bg-success h-auto me-1 rounded-circle">${tasks?.length}</span> Finished`;
    tasks.map(task => {
      const taskCard = taskCardUI(task);
      BoardBody.appendChild(taskCard);
    });
  },
  add: (el, task) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);

    const taskCard = taskCardUI(task);
    BoardBody.appendChild(taskCard);
    taskBoardAutoScrollBottom(BoardBody);
    taskBoardScroll();
  },

  updateBadge: (el, count) => {
    const { BoardTitle } = getBoardElements(el);
    const BoardTitleBadge = BoardTitle.querySelector(".board-badge");
    BoardTitleBadge.textContent = count;
  },
};

function getBoardElements(board) {
  const Board = board;
  const BoardTitle = Board.querySelector("#board-title");
  const BoardBody = Board.querySelector("#board-body");

  return { Board, BoardTitle, BoardBody };
}

export function getBoard(taskId) {
  const ProjectTaskBoards = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  return ProjectTaskBoards.filter(board => board.id == taskId)[0];
}

export function taskBoardAutoScrollToElement(element, board) {
  const elementScrollTo = element.offsetTop;
  const scrollTo = elementScrollTo - element.clientHeight;

  board.scrollTo({
    top: scrollTo,
  });
}

export function taskBoardAutoScrollBottom(el) {
  const scrollHeight = el.scrollHeight;
  el.scrollTo({
    top: scrollHeight,
  });
}

export const taskBoardScroll = el => {
  const ProjectTaskCard = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  ProjectTaskCard.forEach(card => {
    card.classList.add("border");
    const cardBody = card.querySelector(".card-project-task-body");
    const scrollHeight = cardBody.scrollHeight;
    // console.log(object)
    if (scrollHeight > 450) {
      cardBody.classList.add("card-project-task-body-scroll");
      cardBody.scrollTo({
        top: scrollHeight,
      });
    } else {
      cardBody.classList.remove("card-project-task-body-scroll");
    }
  });
};

export const moveBoardItem = (toBoard, task, beforeTask, nextTask) => {
  const movedTask = getTaskCard(task._id);
  const { BoardBody } = getBoardElements(toBoard);

  taskBoardRemoveItem(movedTask);
  if (nextTask) {
    const nextTaskEl = getTaskCard(nextTask._id);
    nextTaskEl.parentNode.insertBefore(movedTask, nextTaskEl);
  } else if (beforeTask) {
    const beforeTaskEl = getTaskCard(beforeTask._id);
    beforeTaskEl.parentNode.insertBefore(movedTask, beforeTaskEl.nextSibling);
  } else {
    BoardBody.appendChild(movedTask);
  }

  taskBoardScroll();
  taskBoardAutoScrollToElement(movedTask, BoardBody);

  // taskBoardAutoScrollBottom(BoardBody);
};

export const taskBoardRemoveItem = el => {
  const ElParent = el.parentNode;
  ElParent?.removeChild(el);
};
