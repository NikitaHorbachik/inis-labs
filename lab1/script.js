function renderShirts(shirtArray) {
  const container = document.getElementById("shirtDisplay");

  shirtArray.forEach((shirt) => {
    const shirtDiv = document.createElement("div");
    shirtDiv.className = "shirt";

    const title = document.createElement("h3");
    title.textContent = shirt.name;

    const image = document.createElement("img");
    if (shirt.colors && Object.keys(shirt.colors).length > 0) {
      const firstColor = Object.keys(shirt.colors)[0];
      image.src = shirt.colors[firstColor].front;
    } else {
      image.src = shirt.default.front;
    }
    image.alt = shirt.name;

    const colorCount = Object.keys(shirt.colors).length;
    const shirtInfo = document.createElement("p");
    if (colorCount === 1) {
      shirtInfo.textContent = `Майка "${shirt.name}" доступна в ${colorCount} цвете.`;
    } else {
      shirtInfo.textContent = `Майка "${shirt.name}" доступна в ${colorCount} цветах.`;
    }

    const quickViewButton = document.createElement("button");
    quickViewButton.textContent = "Быстрый просмотр";
    quickViewButton.addEventListener("click", () => showQuickView(shirt));

    const seePageButton = document.createElement("button");
    seePageButton.textContent = "Смотреть страницу";
    seePageButton.addEventListener("click", () => goToDetailsPage(shirt));

    shirtDiv.appendChild(title);
    shirtDiv.appendChild(image);
    shirtDiv.appendChild(shirtInfo);
    shirtDiv.appendChild(quickViewButton);
    shirtDiv.appendChild(seePageButton);

    container.appendChild(shirtDiv);
  });
}

function goToDetailsPage(shirt) {
  localStorage.setItem("selectedShirt", JSON.stringify(shirt));
  window.location.href = "../lab2/details.html";
}

function showQuickView(shirt) {
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modal-content");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");
  const modalImage = document.getElementById("modalImage");

  modalTitle.textContent = shirt.name;
  modalDescription.textContent = shirt.description;
  modalPrice.textContent = `Цена: ${shirt.price}`;

  let colorKeys = Object.keys(shirt.colors);
  let index = 0;

  function showNextImage() {
    if (colorKeys.length > 1) {
      modalImage.src = shirt.colors[colorKeys[index]].front;
      index = (index + 1) % colorKeys.length;
      setTimeout(showNextImage, 3000);
    } else if (colorKeys.length === 1) {
      modalImage.src = shirt.colors[colorKeys[0]].front;
    } else {
      modalImage.src = shirt.default.front;
    }
  }

  showNextImage();

  modal.style.display = "block";

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

renderShirts(shirts);
