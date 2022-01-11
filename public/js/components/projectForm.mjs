import TagsInput from "./tagsInput.mjs";

const ProjectForm = () => {
  const projectForm = document.getElementById("form-project");

  if (projectForm) {
    const StatusSelect = projectForm.querySelector("#status");

    if (StatusSelect) {
      const defaultValue = StatusSelect.getAttribute("data-defaultValue");
      const StatusSelectOptions = [].slice.call(
        StatusSelect.querySelectorAll("option")
      );

      StatusSelectOptions.forEach(opt => {
        opt.removeAttribute("selected");

        if (opt.value == defaultValue) {
          opt.setAttribute("selected", "true");
        }
      });
    }
  }

  new TagsInput({
    selector: "tag-input",
    tagClass: "me-1 badge bg-primary text-current ",
    wrapperClass: "form-control bg-transparent",
  });
};

document.addEventListener("DOMContentLoaded", () => ProjectForm());
