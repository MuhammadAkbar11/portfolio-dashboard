const taskIcon = {
  TODO: feather.icons["file-text"].toSvg({ class: "me-1 mt-n1" }),
  PROGRESS: feather.icons["activity"].toSvg({ class: "me-1 mt-n1" }),
  DONE: feather.icons["check-circle"].toSvg({ class: "me-1 mt-n1" }),
  ARROW_RIGHT: feather.icons["arrow-right"].toSvg({ class: "mx-1" }),
  ARROW_LEFT: feather.icons["arrow-left"].toSvg({ class: "mx-1" }),
};

const taskSwitch = data => {
  const stringifyData = JSON.stringify(data);
  const schema = {
    TODO: `
    <a href="javascript:void(0)" class="p-0 text-gray "  id="task-move" data-destination="PROGRESS" data-task='${stringifyData}' > ${taskIcon["ARROW_RIGHT"]}</a>
    `,
    PROGRESS: `
    <a href="javascript:void(0)" class="p-0 text-gray"  id="task-move" data-destination="TODO" data-task='${stringifyData}'  >${taskIcon["ARROW_LEFT"]}</a>
    <a href="javascript:void(0)" class="p-0 text-gray"  id="task-move" data-destination="DONE" data-task='${stringifyData}'   class="ms-n1">${taskIcon["ARROW_RIGHT"]}</a>
    `,
    DONE: `
    <a href="javascript:void(0)" class="p-0 text-gray"  id="task-move" data-destination="PROGRESS" data-task='${stringifyData}' >${taskIcon["ARROW_LEFT"]}</a>
    `,
  };

  return schema[data.status];
};

export const taskCardUI = data => {
  const taskCardBacklog = document.createElement("div");
  taskCardBacklog.setAttribute("id", "tasks-backlog");
  taskCardBacklog.setAttribute("data-key", data._id);
  taskCardBacklog.style.minHeight = "40px";

  const stringifyData = JSON.stringify(data);

  taskCardBacklog.innerHTML = `
  <div class="card mb-3 bg-light cursor-grab border">
    <div class="card-body px-3 pb-2">
      <div class="float-end ms-1 me-n2">
        <div class="dropdown position-relative">
          <a href="#" data-bs-toggle="dropdown" id=${
            data._id
          }Label" data-bs-display="static" aria-expanded="false" class="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-more-horizontal align-middle">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </a>

          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="${
            data._id
          }Label">
            <a class="dropdown-item" href="#" id="task-edit" data-task='${stringifyData}
            '>Edit</a>
            <a class="dropdown-item" href="#" id="task-delete" data-task='${stringifyData}'>Delete</a>
          </div>
        </div>
      </div>
      <div class="d-flex gap-1"><span>${taskIcon[data.status]}</span><p>${
    data.note
  }</p></div>
      <div class="float-end me-n2">
        ${taskSwitch(data)}
      </div>
    </div>
  </div>
`;
  return taskCardBacklog;
};

export const updateTaskCardUI = data => {
  const taskCardBacklog = getTaskCard(data._id);
  const stringifyData = JSON.stringify(data);
  taskCardBacklog.innerHTML = `
  <div class="card mb-3 bg-light cursor-grab border">
    <div class="card-body px-3 pb-2">
      <div class="float-end ms-1 me-n2">
        <div class="dropdown position-relative">
          <a href="#" data-bs-toggle="dropdown" id=${
            data._id
          }Label" data-bs-display="static" aria-expanded="false" class="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-more-horizontal align-middle">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </a>

          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="${
            data._id
          }Label">
            <a class="dropdown-item" href="#" id="task-edit" data-task='${stringifyData}
            '>Edit</a>
            <a class="dropdown-item" href="#" id="task-delete" data-task='${stringifyData}'>Delete</a>
          </div>
        </div>
      </div>
      <div class="d-flex gap-1"><span>${taskIcon[data.status]}</span><p>${
    data.note
  }</p></div>
      <div class="float-end me-n2">
        ${taskSwitch(data)}
      </div>
    </div>
  </div>
`;
};

export const getTaskCard = taskId => {
  return [].slice
    .call(document.querySelectorAll("#tasks-backlog"))
    .filter(x => x.dataset.key == taskId)[0];
};

// document.querySelector("")
