import { io } from "socket.io-client";

const socket = io();

export function socketLoadProjectTasks(projectId, cb) {
  socket.emit("project-tasks", { projectId }, (err, data) => {
    if (err) {
      return;
    }
    cb(null, data);
  });
}

export function socketCreateProjectTasks(newTask, cb) {
  socket.emit("create-project-task", newTask, (err, data) => {
    if (err) {
      return cb && cb(err, null);
    }

    cb && cb(null, data);
  });
}

export function socketDeleteProjectTasks(data, cb) {
  socket.emit("delete-project-task", data, (err, data) => {
    if (err) {
      return cb && cb(err, null);
    }

    cb && cb(null, data);
  });
}

export function socketUpdateProjectTasks(data, cb) {
  socket.emit("edit-project-task", data, (err, data) => {
    if (err) {
      return cb && cb(err, null);
    }

    cb && cb(null, data);
  });
}
