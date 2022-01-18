import { taskCardUI } from "./taskCard.mjs";

export const boardsHandleIU = {
  todo: (el, tasks) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);
    BoardTitle.innerHTML = `<span class="badge bg-primary h-auto me-1 rounded-circle">${tasks?.length}
  </span> Todo`;
    tasks.map(task => {
      const taskCard = taskCardUI(task);
      BoardBody.appendChild(taskCard);
    });
  },
  progress: (el, tasks) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);
    BoardTitle.innerHTML = `<span class="badge bg-warning h-auto me-1 rounded-circle">${tasks?.length}
  </span> In Progress`;
    tasks.map(task => {
      const taskCard = taskCardUI(task);
      BoardBody.appendChild(taskCard);
    });
  },
  done: (el, tasks) => {
    const { BoardTitle, BoardBody } = getBoardElements(el);
    BoardTitle.innerHTML = `<span class="badge bg-success h-auto me-1 rounded-circle">${tasks?.length}
  </span> Finished`;
    tasks.map(task => {
      const taskCard = taskCardUI(task);
      BoardBody.appendChild(taskCard);
    });
  },
};

function getBoardElements(board) {
  const Board = board;
  const BoardTitle = Board.querySelector("#board-title");
  const BoardBody = Board.querySelector("#board-body");

  return { Board, BoardTitle, BoardBody };
}

export const taskBoardScroll = el => {
  const ProjectTaskCard = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  ProjectTaskCard.forEach(card => {
    card.classList.add("border");
    const cardBody = card.querySelector(".card-project-task-body");
    const cardBodyHeight = cardBody.clientHeight;
    const scrollHeight = cardBody.scrollHeight;
    if (cardBodyHeight > 310) {
      cardBody.classList.add("card-project-task-body-scroll");
      cardBody.scrollTo({
        top: scrollHeight,
      });
    }
  });
};
