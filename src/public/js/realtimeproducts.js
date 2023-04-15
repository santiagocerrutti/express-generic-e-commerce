const socket = io();

function buildProductCard(product) {
  return `
  <div class="card" style="width: 18rem;">
    <img class="card-img-top" src=${product.thumbnails} alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${product.title}</h5>
      <p class="card-text">${product.description}</p>
      <a href="#" class="btn btn-outline-primary">$ ${product.price}</a>
    </div>
  </div>
  `;
}

socket.on("update-products-ui", (products) => {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  for (const p of products) {
    productsContainer.innerHTML += buildProductCard(p);
  }
});
