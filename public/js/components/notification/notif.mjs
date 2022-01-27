import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

function NotifUI(notif) {
  const NotifListGroupItem = document.createElement("a");
  NotifListGroupItem.setAttribute("id", "notif-list-group-item");
  NotifListGroupItem.setAttribute("data-key", notif._id);
  NotifListGroupItem.href = notif.url;
  NotifListGroupItem.className = "list-group-item";

  const Icon = feather.icons[notif.theme?.icon].toSvg({
    class: `mx-1 text-${notif.theme?.color}`,
  });
  const time = dayjs(new Date(notif.createdAt)).fromNow();

  NotifListGroupItem.innerHTML = `
    <div class="row g-0 align-items-center">
      <div class="col-2">
      ${Icon}
      </div>
      <div class="col-10">
        <div class="text-dark text-capitalize">${notif.title}</div>
        <div class="text-muted small mt-1">
        ${notif.content}
        </div>
        <div class="text-muted small mt-1">${time}</div>
      </div>
    </div>
  `;

  return NotifListGroupItem;
}

export default NotifUI;
