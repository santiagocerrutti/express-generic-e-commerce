let addToCartButtons = document.getElementsByClassName("add-to-cart-button");

for (const button of addToCartButtons) {
  button.addEventListener("click", (event) => {
    console.log(event.target.dataset);
  });
}
