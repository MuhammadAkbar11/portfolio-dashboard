import NotifUI from "./notif.mjs";

function NotifListUI(data) {
  const { listNotif } = data;
  const NotifDropdownMenu = document.getElementById(
    "notif-header-dropdown-menu"
  );

  const NotifListGroup = document.createElement("div");
  NotifListGroup.setAttribute("id", "notif-list-group");
  NotifListGroup.className = "list-group";
  const NotifNotifDropdownMenuFooter = document.createElement("div");
  NotifNotifDropdownMenuFooter.className = "dropdown-menu-footer";
  NotifNotifDropdownMenuFooter.innerHTML = `<a href="/notifications" class="text-muted">Show all notifications</a>`;

  if (listNotif.length !== 0) {
    listNotif?.map(notif => {
      const notifCard = NotifUI(notif);
      NotifListGroup.appendChild(notifCard);
    });

    NotifDropdownMenu.appendChild(NotifListGroup);
    NotifDropdownMenu.appendChild(NotifNotifDropdownMenuFooter);
  }
}

export function resetNotifList(parentEl) {
  const ListGroup = parentEl.querySelector("#notif-list-group");
  const DropdownFooter = parentEl.querySelector(".dropdown-menu-footer");
  if (ListGroup && DropdownFooter) {
    ListGroup.parentNode.removeChild(ListGroup);
    DropdownFooter.parentNode.removeChild(DropdownFooter);
  }
}

export default NotifListUI;
