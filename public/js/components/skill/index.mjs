function initSkill() {
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
  let listSkill = null;
  event.preventDefault();
  const target = event.target;

  if (target?.dataset.skill) {
    skill = target.dataset?.skill;
    listSkill = target.dataset?.skills;
  } else if (target.parentNode.dataset?.skill) {
    skill = target.parentNode.dataset?.skill;
    listSkill = target.parentNode.dataset?.skills;
  } else if (target.parentNode.parentNode.dataset?.skill) {
    skill = target.parentNode.parentNode.dataset?.skill;
    listSkill = target.parentNode.parentNode.dataset?.skills;
  }

  skill = JSON.parse(skill);
  listSkill = JSON.parse(listSkill);

  if (skill) {
    const SkillFormModal = document.getElementById("skillFormModal");

    const ModalTitle = SkillFormModal.querySelector(".modal-title");
    const ModalBody = SkillFormModal.querySelector(".modal-body");
    const FormModal = ModalBody.querySelector("#form-skill");
    // FormModal.setAttribute("action", "/profile/skills/" + skill._id);

    const SkillOrderSelect = createOrderSelect({ skill, skills: listSkill });
    FormModal.insertBefore(
      SkillOrderSelect,
      FormModal.querySelector("[name=skillId]")
    );
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
  const OrderSelect = FormModal.querySelector("[name=order]");

  if (OrderSelect) {
    const OrderSelectParent = OrderSelect.parentNode;
    OrderSelectParent.parentNode?.removeChild(OrderSelectParent);
  }

  FormModal.setAttribute("action", "/skills");
  FormModal.querySelector("[name=_method]").value = "POST";
  FormModal.querySelector("[name=skillName]").value = "";
  ModalTitle.innerHTML = "Create Skill";
  modalEl.classList.add("fade");
}

function createOrderSelect(data) {
  const parent = document.createElement("div");
  parent.className = "mb-3";
  parent.innerHTML = orderSelectUI(data.skill, data.skills);

  return parent;
}

function orderSelectUI(selected, skills) {
  const options = skills.map((x, idx) => {
    return `<option ${selected._id === x._id && "selected"} value="${
      x.order
    }">${idx + 1} - ${x.name}</option>`;
  });

  return `
    <label for="order" class="form-label">Order</label>
    <select class="form-select" name="order" aria-label="Default select example">
      <option selected>Open this select menu</option>
      ${options.join("\n")}
    </select>
  `;
}

initSkill();
