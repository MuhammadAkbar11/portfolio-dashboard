const projectDetails = () => {
  projectTask();
};

const projectTask = () => {
  const ProjectTaskCard = [].slice.call(
    document.querySelectorAll(".card-project-task")
  );

  ProjectTaskCard.forEach(card => {
    card.classList.add("border");
    const cardBody = card.querySelector(".card-project-task-body");

    console.log(cardBody);
    const cardBodyHeight = cardBody.clientHeight;
    console.log(cardBodyHeight);
    if (cardBodyHeight > 310) {
      cardBody.classList.add("card-project-task-body-scroll");
    }
    //     if (crdHeight > 350) {
    //       card.style.css = `
    //       max-height: 350px
    //       over
    // `;
    //     }
  });
};

document.addEventListener("DOMContentLoaded", () => projectDetails());
