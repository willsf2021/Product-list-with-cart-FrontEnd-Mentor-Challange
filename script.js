// Criação do Array que vai conter os produtos que estão no Object .JSON
let cartArray = [];
// Função que carregará o conteúdo dos produtos que estão em datas.json no HTML.
function load() {
  fetch("data.json")
    .then((response) => response.json())
    .then((datas) => {
      const dessertContainer = document.querySelector("#section-main");
      datas.map((data) => {
        // Push(Adicionando Itens) no ArrayCart
        cartArray.push(data);
        // Criando Elementos
        const dessert = document.createElement("div");
        const dessertIndividual = document.createElement("div");
        const img = document.createElement("img");
        const imgButton = document.createElement("img");
        const button = document.createElement("button");
        const divInfos = document.createElement("div");
        const categoryDessert = document.createElement("p");
        const nameDessert = document.createElement("p");
        const priceDessert = document.createElement("p");
        // Adicionando Classes
        dessert.classList.add("container");
        dessert.classList.add("container-picture-button");
        img.classList.add("picture");
        button.classList.add("button");
        categoryDessert.classList.add("category-dessert");
        nameDessert.classList.add("name-dessert");
        priceDessert.classList.add("price-dessert");
        // Modificando Atributos
        img.src = data.image.desktop;
        img.alt = data.name;
        imgButton.src = "assets/images/icon-add-to-cart.svg";
        imgButton.alt = "cart-icon";
        // Adicionando Conteúdo de Texto
        button.textContent = "Add to Cart";
        button.setAttribute("data-id", data.name);
        button.addEventListener("click", () => {
          const dessertName = button.getAttribute("data-id");
          addToCart(dessertName);
        });
        categoryDessert.textContent = data.category;
        nameDessert.textContent = data.name;
        priceDessert.textContent = `$${data.price.toFixed(2)}`;
        // Adicionando filhos
        button.appendChild(imgButton);
        dessertIndividual.appendChild(img);
        dessertIndividual.appendChild(button);
        dessert.appendChild(dessertIndividual);
        dessertContainer.appendChild(dessert);
        divInfos.appendChild(categoryDessert);
        divInfos.appendChild(nameDessert);
        divInfos.appendChild(priceDessert);
        dessert.appendChild(divInfos);
      });
    });
}

load();
// Variável que conterá os itens adicionados no carrinho
let cart = [];
// Seleção da DIV que conterá o carrinho no HTML.
let cartItems = document.querySelector("#cart");
// Função que adiciona o item clicado ao carrinho
function addToCart(dessertName) {
  const item = cartArray.find((product) => product.name === dessertName);

  cart.push({
    ...item,
    numberOfUnitys: 1,
  });
  console.log(cart);
  updateCart();
}

function updateCart() {
  renderCartItems();
  // renderSubtotal();
}

function renderCartItems() {
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    cartItems.innerHTML += `
    <div id="render-here">
          <p class="name-item">${item.name}</p>
          <div class="datas-cart-plus-remove">
            <div class="dessert-datas-cart">
              <p class="quantity-cart"><span>${item.numberOfUnitys}</span>x</p>
              <p class="unit-price">@$${item.price.toFixed(2)}</p>
              <p class="total-price-item">${(
                item.numberOfUnitys * item.price
              ).toFixed(2)}</span></p>
            </div>
            <img
              class="remove-icon"
              src="assets/images/icon-remove-item.svg"
              alt="remove-icon"
            />
          </div>
          <hr />
        </div>
    `;
  });
}
