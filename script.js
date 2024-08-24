// Criação do Array que vai conter os produtos que estão no Object .JSON
let dataCopy = [];

// Função que carregará o conteúdo dos produtos que estão em data.json no HTML
function load() {
  fetch("data.json")
    .then((response) => response.json())
    .then((datas) => {
      const dessertContainer = document.querySelector("#section-main");
      datas.forEach((data) => {
        // Push(Adicionando Itens) no ArrayCart
        dataCopy.push(data);

        // Criando Elementos
        const dessert = document.createElement("div");
        const dessertIndividual = document.createElement("div");
        const img = document.createElement("img");
        const button = document.createElement("button");
        const divInfos = document.createElement("div");
        const categoryDessert = document.createElement("p");
        const nameDessert = document.createElement("p");
        const priceDessert = document.createElement("p");

        // Adicionando Classes
        dessert.classList.add("container");
        dessertIndividual.classList.add("container-picture-button");
        img.classList.add("picture");
        button.classList.add("button");
        divInfos.classList.add("dessert-info");
        categoryDessert.classList.add("category-dessert");
        nameDessert.classList.add("name-dessert");
        priceDessert.classList.add("price-dessert");

        // Modificando Atributos
        img.src = data.image.desktop;
        img.alt = data.name;

        // Adicionando Conteúdo de Texto
        const imgButton = document.createElement("img");
        imgButton.src = "assets/images/icon-add-to-cart.svg";
        imgButton.alt = "cart-icon";
        button.appendChild(imgButton);
        button.innerHTML += " Add to Cart";

        button.setAttribute("data-id", data.name);
        button.addEventListener("click", (e) => {
          if (!e.target.classList.contains("btn-quantity")) {
            const dessertName = button.getAttribute("data-id");
            if (
              document.querySelector(
                `button[data-id='${dessertName}'] .quantity`
              )
            ) {
              // Já está em modo de controle de quantidade
              return;
            }
            replaceButtonWithQuantityControl(button, dessertName);
            addToCart(dessertName);
          }
        });

        categoryDessert.textContent = data.category;
        nameDessert.textContent = data.name;
        priceDessert.textContent = `$${data.price.toFixed(2)}`;

        // Adicionando filhos
        dessertIndividual.appendChild(img);
        dessertIndividual.appendChild(button);
        divInfos.appendChild(categoryDessert);
        divInfos.appendChild(nameDessert);
        divInfos.appendChild(priceDessert);
        dessert.appendChild(dessertIndividual);
        dessert.appendChild(divInfos);
        dessertContainer.appendChild(dessert);
      });
    });
}

load();

let cart = [];

// Seleção da DIV que conterá o carrinho no HTML
let cartItems = document.querySelector("#cart");

// Função que adiciona o item clicado ao carrinho
function addToCart(dessertName) {
  const item = dataCopy.find((product) => product.name === dessertName);
  const existingItem = cart.find((product) => product.name === dessertName);

  if (existingItem) {
    existingItem.numberOfUnitys++;
  } else {
    cart.push({
      ...item,
      numberOfUnitys: 1,
    });
  }

  updateCart();
}

// Substitui o botão "Add to Cart" por controle de quantidade
// Substitui o botão "Add to Cart" por controle de quantidade
function replaceButtonWithQuantityControl(button, dessertName) {
  const quantityControl = document.createElement("div");
  quantityControl.classList.add("quantity-control");

  // Criar uma div para os botões '+' e '-'
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const buttonMinus = document.createElement("button");
  buttonMinus.classList.add("btn-quantity", "minus");
  buttonMinus.textContent = "-";

  const quantitySpan = document.createElement("span");
  quantitySpan.classList.add("quantity");
  quantitySpan.textContent = "1";

  const buttonPlus = document.createElement("button");
  buttonPlus.classList.add("btn-quantity", "plus");
  buttonPlus.textContent = "+";

  buttonContainer.appendChild(buttonMinus);
  buttonContainer.appendChild(quantitySpan);
  buttonContainer.appendChild(buttonPlus);

  quantityControl.appendChild(buttonContainer);

  // Substituir o conteúdo do botão original pelo controle de quantidade
  button.replaceWith(quantityControl);

  // Adicionar eventos de clique aos botões de quantidade
  buttonMinus.addEventListener("click", () => {
    updateQuantity(dessertName, "minus", quantitySpan, quantityControl, button);
  });

  buttonPlus.addEventListener("click", () => {
    updateQuantity(dessertName, "plus", quantitySpan);
  });
}

// Atualiza a quantidade no carrinho e na interface
function updateQuantity(
  dessertName,
  action,
  quantitySpan,
  quantityControl,
  originalButton
) {
  const item = cart.find((product) => product.name === dessertName);

  if (item) {
    if (action === "plus") {
      item.numberOfUnitys++;
      quantitySpan.textContent = item.numberOfUnitys;
    } else if (action === "minus") {
      item.numberOfUnitys--;
      quantitySpan.textContent = item.numberOfUnitys;
      if (item.numberOfUnitys <= 0) {
        remove(dessertName);
        // Substituir o controle de quantidade pelo botão "Add to Cart"
        quantityControl.replaceWith(originalButton);
        return;
      }
    }
    updateCart();
  }
}

// Remove um item do carrinho
function remove(dessertName) {
  cart = cart.filter((item) => item.name !== dessertName);
  updateCart();
}

// Atualiza o carrinho e o total
function updateCart() {
  renderCartItems();
  renderSubtotal();
  updateCartItemCount();
}

// Renderiza itens do carrinho
function renderCartItems() {
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    let element = `
    <div id="render-here-${item.name}">
          <p class="name-item">${item.name}</p>
          <div class="datas-cart-plus-remove">
            <div class="dessert-datas-cart">
              <p class="quantity-cart">
                <span>${item.numberOfUnitys}</span>
              </p>
              <p class="unit-price">@$${item.price.toFixed(2)}</p>
              <p class="total-price-item">${(
                item.numberOfUnitys * item.price
              ).toFixed(2)}</p>
            </div>
            <img
              class="remove-icon"
              src="assets/images/icon-remove-item.svg"
              alt="remove-icon"
              data-name="${item.name}"
            />
          </div>
          <hr />
        </div>
        `;
    cartItems.innerHTML += element;

    // Adicionando eventos aos botões de remover
    document.querySelectorAll(".remove-icon").forEach((icon) => {
      icon.addEventListener("click", () => {
        const removeName = icon.getAttribute("data-name");
        remove(removeName);
      });
    });
  });
}

// Renderiza o subtotal do carrinho
function renderSubtotal() {
  const orderTotal = document.querySelector("#order-total");
  const subtotal = cart.reduce(
    (total, item) => total + item.numberOfUnitys * item.price,
    0
  );
  orderTotal.textContent = `Total: $${subtotal.toFixed(2)}`;
}

// Atualiza a quantidade na interface de 'dessert'
function updateDessertQuantity(dessertName, action) {
  const button = document.querySelector(`button[data-id='${dessertName}']`);
  const quantitySpan = button.querySelector(".quantity");

  if (action === "plus") {
    quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
  } else if (action === "minus") {
    quantitySpan.textContent = parseInt(quantitySpan.textContent) - 1;
    if (parseInt(quantitySpan.textContent) <= 0) {
      button.innerHTML =
        "<img src='assets/images/icon-add-to-cart.svg' alt='cart-icon' /> Add to Cart";
      button.classList.remove("button-active");
      button
        .closest(".container-picture-button")
        .querySelector(".picture")
        .classList.remove("img-dessert-active");
    }
  }
}

// Adicionar eventos para botões '+' e '-' nas 'desserts'
document.querySelector("#section-main").addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-quantity")) {
    event.stopPropagation(); // Impede a propagação do clique para o botão pai
    const action = event.target.classList.contains("plus") ? "plus" : "minus";
    const dessertName = event.target.closest("button").getAttribute("data-id");

    // Chamando a função para atualizar a quantidade
    updateDessertQuantity(dessertName, action);
  }
});
function updateCartItemCount() {
  const cartItemCount = cart.reduce(
    (total, item) => total + item.numberOfUnitys,
    0
  );
  const resumeCart = document.querySelector("#resume-cart");
  resumeCart.textContent = `${cartItemCount}`;
}
