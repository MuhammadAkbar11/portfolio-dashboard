const TabNav = document.getElementById("profile-tab");

// function initQuery

function setQuery(name, value) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(name, value);
  const newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newRelativePathQuery);
}

function initProfileTabs() {
  if (TabNav) {
    const TabNavLinks = [].slice.call(TabNav.querySelectorAll(".nav-link"));

    const searchParams = new URLSearchParams(window.location.search);

    TabNavLinks.forEach(tab => {
      const tabBsTarget = tab.getAttribute("data-bs-target").split("-")[1];
      if (searchParams.has("tab") && searchParams.get("tab") == tabBsTarget) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
      } else {
        if (!searchParams.has("tab")) {
          const bsTab = new bootstrap.Tab(TabNavLinks[0]);
          bsTab.show();
        }
      }

      tab.addEventListener("click", ev => {
        const targetBsTarget = ev.target
          .getAttribute("data-bs-target")
          .split("-")[1];
        setQuery("tab", targetBsTarget);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => initProfileTabs());
