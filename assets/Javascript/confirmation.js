// récupérer les données stockées sur le local storage

let confirmation = JSON.parse(localStorage.getItem('orderConfirmation'));
console.log(confirmation);
let price = 0;

// afficher l'identifiant de la commande 

document.getElementById('order-ref').textContent = confirmation.orderId;

// afficher le prix sur la page

for(let i = 0 ; i < confirmation.products.length ; i++) {
    price += confirmation.products[i].price;
}

document.getElementById('total-price').textContent = price/100;

// vider le localstorage

localStorage.removeItem('orderConfirmation');
