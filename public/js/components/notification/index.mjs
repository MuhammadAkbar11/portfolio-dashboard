import socketClient from "@socket/index.mjs";
import NotifListUI, { resetNotifList } from "./notifList.mjs";

function loadNotifSocket() {
  socketClient.emit("load-count-new-notif", { limit: 5 }, err => {
    console.log(err);
  });
}

function resetUnreadNotif(el) {
  socketClient.emit("reset-unread-notif", err => {
    if (err) {
      console.log(err);
      return;
    }
    NotifIndicatorUI(el, 0);
  });
}

function loadNotif(data) {
  const NotificationDropdown = document.getElementById("notif-header-dropdown");

  if (NotificationDropdown) {
    const NotifDropdownMenu = NotificationDropdown.querySelector(
      "#notif-header-dropdown-menu"
    );
    resetNotifList(NotifDropdownMenu);
    const NotifDropdownToggle =
      NotificationDropdown.querySelector(".dropdown-toggle");

    NotifIndicatorUI(NotifDropdownToggle, data?.count);
    NotifListUI(data);
    console.log(data);
    NotifDropdownToggle.addEventListener("click", event => {
      resetUnreadNotif(NotifDropdownToggle);
    });
  }
}

function NotifIndicatorUI(el, value) {
  const Indicator = el.querySelector(".indicator");
  const NotifDropdownMenuHeader = el.parentNode.querySelector(
    ".dropdown-menu-header"
  );
  Indicator.textContent = value;
  NotifDropdownMenuHeader.textContent = `${value} New Notifications`;
}

loadNotifSocket();

socketClient.on("new-notif", data => {
  loadNotifSocket();
});

socketClient.on("count-notif", data => {
  loadNotif(data);
});
