function profileSkillTab() {
  const SkillFormModal = document.getElementById("skillFormModal");
  const btnEditSkill = [].slice.call(document.querySelectorAll("#edit-skill"));

  btnEditSkill.forEach(btn => {
    btn.setAttribute("href", "javascript:void(0)");

    btn.addEventListener("click", createEditSkillModal);
  });

  if (SkillFormModal) {
    SkillFormModal.addEventListener("hidden.bs.modal", function (event) {
      resetEditSkillModal(event.target);
    });
  }
}

function createEditSkillModal(event) {
  let skill = null;
  event.preventDefault();
  const target = event.target;

  if (target?.dataset.skill) {
    skill = target.dataset?.skill;
  } else if (target.parentNode.dataset?.skill) {
    skill = target.parentNode.dataset?.skill;
  } else if (target.parentNode.parentNode.dataset?.skill) {
    skill = target.parentNode.parentNode.dataset?.skill;
  }

  skill = JSON.parse(skill);

  if (skill) {
    const SkillFormModal = document.getElementById("skillFormModal");

    const ModalTitle = SkillFormModal.querySelector(".modal-title");
    const ModalBody = SkillFormModal.querySelector(".modal-body");
    const FormModal = ModalBody.querySelector("#form-skill");
    // FormModal.setAttribute("action", "/profile/skills/" + skill._id);
    FormModal.querySelector("[name=_method]").value = "PUT";
    FormModal.querySelector("[name=skillId]").value = skill._id;
    FormModal.querySelector("[name=skillName]").value = skill.name;
    ModalTitle.innerHTML = "Edit Skill";
    const modal = new bootstrap.Modal(SkillFormModal, {
      keyboard: false,
      backdrop: true,
    });

    modal.show();
  }
}

function resetEditSkillModal(modalEl) {
  const ModalTitle = modalEl.querySelector(".modal-title");
  const ModalBody = modalEl.querySelector(".modal-body");
  const FormModal = ModalBody.querySelector("#form-skill");

  FormModal.setAttribute("action", "/profile/skills");
  FormModal.querySelector("[name=_method]").value = "POST";
  FormModal.querySelector("[name=skillName]").value = "";
  ModalTitle.innerHTML = "Create Skill";
  modalEl.classList.add("fade");
}

profileSkillTab();
