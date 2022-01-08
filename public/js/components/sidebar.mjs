const initialize = () => {
  initializeSidebarLinkActive();
};

const initializeSidebarLinkActive = () => {
  const Sidebar = document.getElementById("sidebar");

  if (Sidebar) {
    const currentPath = Sidebar.getAttribute("data-path");
    const SidebarNav = Sidebar.querySelector(".sidebar-nav");
    const SidebarLinks = [].slice.call(
      SidebarNav.querySelectorAll(".sidebar-link")
    );

    SidebarLinks.forEach(item => {
      const SidebarItem = item.parentElement;
      const itemHref = item.getAttribute("href");

      if (itemHref.toString() === currentPath.toString()) {
        SidebarItem.classList.add("active");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => initialize());
