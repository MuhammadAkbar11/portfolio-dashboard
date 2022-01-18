export const taskCardUI = data => {
  const taskCardBacklog = document.createElement("div");
  taskCardBacklog.setAttribute("id", "tasks-backlog");
  taskCardBacklog.style.minHeight = "40px";

  const taskIcon = {
    TODO: feather.icons["file-text"].toSvg({ class: "me-1 mt-n1" }),
    PROGRESS: feather.icons["activity"].toSvg({ class: "me-1 mt-n1" }),
    DONE: feather.icons["check-circle"].toSvg({ class: "me-1 mt-n1" }),
  };

  taskCardBacklog.innerHTML = `
  <div class="card mb-3 bg-light cursor-grab border">
    <div class="card-body p-3">
      <div class="float-end me-n2">
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
            <a class="dropdown-item" href="#" id="task-edit"
            data-task=${JSON.stringify(data)}>Edit</a>
            <a class="dropdown-item" href="#" id="task-delete"
            data-task=${JSON.stringify(data)}>Delete</a>
          </div>
        </div>
      </div>
      <p> ${taskIcon[data.status]} ${data.note}</p>

    </div>
  </div>
`;

  return taskCardBacklog;
};

// document.querySelector("")
