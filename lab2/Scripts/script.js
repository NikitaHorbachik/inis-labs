const selectedShirt = JSON.parse(localStorage.getItem("selectedShirt"));

function renderShirtDetails() {
  if (!selectedShirt) {
    document.getElementById("shirtDetails").innerHTML =
      "<h3>Майка не найдена!</h3>";
    return;
  }

  const container = document.getElementById("shirtDetails");
  const title = document.createElement("h3");
  title.textContent = selectedShirt.name;

  const image = document.createElement("img");
  let currentView = "front";
  let currentColor = Object.keys(selectedShirt.colors)[0];

  if (selectedShirt.colors && Object.keys(selectedShirt.colors).length > 0) {
    image.src = `../lab1/${selectedShirt.colors[currentColor].front}`;
  } else {
    image.src = `../lab1/${selectedShirt.default.front}`;
  }
  image.alt = selectedShirt.name;

  const description = document.createElement("p");
  description.textContent = `Описание: ${
    selectedShirt.description || "Нет описания"
  }`;

  const price = document.createElement("p");
  price.textContent = `Цена: ${selectedShirt.price}`;

  const colorButtonsContainer = document.createElement("div");
  colorButtonsContainer.className = "color-buttons";

  const colors = selectedShirt.colors;
  Object.keys(colors).forEach((color) => {
    const colorButton = document.createElement("button");
    colorButton.style.backgroundColor = color;
    colorButton.textContent = color;

    colorButton.addEventListener("click", () => {
      currentColor = color;
      image.src = `../lab1/${colors[color][currentView]}`;
    });

    colorButtonsContainer.appendChild(colorButton);
  });

  const viewButtonsContainer = document.createElement("div");
  viewButtonsContainer.className = "view-buttons";

  if (selectedShirt.colors[currentColor].front) {
    const frontButton = document.createElement("button");
    frontButton.textContent = "Front";
    frontButton.className = "color-button";
    frontButton.addEventListener("click", () => {
      currentView = "front";
      image.src = `../lab1/${colors[currentColor].front}`;
    });
    viewButtonsContainer.appendChild(frontButton);
  }

  if (selectedShirt.colors[currentColor].back) {
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.className = "color-button";
    backButton.addEventListener("click", () => {
      currentView = "back";
      image.src = `../lab1/${colors[currentColor].back}`;
    });
    viewButtonsContainer.appendChild(backButton);
  }

  container.appendChild(title);
  container.appendChild(image);
  container.appendChild(description);
  container.appendChild(price);
  container.appendChild(colorButtonsContainer);
  container.appendChild(viewButtonsContainer);
}

document.addEventListener("DOMContentLoaded", renderShirtDetails);
