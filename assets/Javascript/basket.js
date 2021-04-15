/* variables globales */
const basket = new Map(); 
let basketBtn = document.getElementById('clear-basket');
let productArray = [];
let submitBtn = document.getElementById('submit');
//submitBtn.disabled = true;

/* vider le panier */

//vider le panier
basketBtn.addEventListener('click', () => {
    localStorage.removeItem('basket');
    clearBasket()
})

/* Afficher le résumé du panier */

// Récupérer le contenu du local storage (panier en cours)
const processBasket = () => {
    let storageContent = JSON.parse(localStorage.getItem('basket'));
    if(storageContent != null) {
        summarizeOrder(storageContent)
        displayData(basket)
        displayTotalPrice(basket)
        basketBtn.disabled = false;
    } else {
        clearBasket()
    }

};

// Ajouter dans la Map basket les éléments du storage en "fusionnant" les doublons 
const summarizeOrder = (data) => {
    for (let i = 0 ; i < data.length ; i++) {
        let newId = data[i].id + data[i].color.replace(/\s/g, '');  
        let qty = parseInt(data[i].quantity);
        if(basket.has(newId)) { 
            let currentQty = parseInt(basket.get(newId).quantity); 
            currentQty += qty;
            basket.delete(newId);
            let newItem = {id: data[i].id, name: data[i].name, color: data[i].color, quantity: currentQty, price: data[i].price};
            basket.set(newId, newItem);
        } else {
            basket.set(newId, data[i]);
        }   
    }
    console.log(basket);
    return basket
};

// Afficher les données du résumé de commande sur la page 

const displayData = (data) => {
    for(let item of data.values()){
        let newLine = document.createElement('tr');
        document.getElementById('table').appendChild(newLine);
        let name = document.createElement('td');
        let color = document.createElement('td');
        let quantity = document.createElement('td');
        let price = document.createElement('td');
        newLine.appendChild(name);
        newLine.appendChild(color);
        newLine.appendChild(quantity);
        newLine.appendChild(price);
        name.textContent = item.name;
        color.textContent = item.color;
        quantity.textContent = item.quantity;
        price.textContent = item.price;
    }
}

// Afficher le prix total 

const displayTotalPrice = (data) => {
    let totalPrice = 0;
    for (let item of data.values()) {
        let itemPrice = item.quantity * item.price;
        totalPrice += itemPrice;
    }
    let displayedPrice = document.createElement('p');
    displayedPrice.classList.add('total-price');
    document.getElementById('price-container').appendChild(displayedPrice);
    displayedPrice.textContent = 'Prix total à payer : ' + totalPrice + ' €';
    displayedPrice.classList.add('text-primary', 'text-center', 'border', 'border-primary');
}

// Vider le panier 

const clearBasket = () => {
    document.getElementById('price-container').textContent = '';
    document.getElementById('table').textContent = '';
    document.getElementById('basket-info').textContent = 'Votre panier est vide';
    productArray = [];
    console.log('array quand panier vidé ', productArray);
    basketBtn.disabled = true;
};

/* Tableau de produits à envoyer au serveur */
// les produit sont envoyés sous forme d'un tableau contenant des strings product_id 

const buildOrderArray = () => {
    if(basket != null) {
        for(let item of basket.values()) {
            let itemId = item.id;
            let itemQuantity = parseInt(item.quantity);
            for(let i = 0 ; i < itemQuantity ; i++) {
                productArray.push(itemId);
            }
        }
        console.log('tableau à envoyer au serveur ', productArray);
    }
}

processBasket()
buildOrderArray()

//test 2

document.forms['order-form'].addEventListener('submit', (e) => {
    let error;
    let inputs = this;
    let formMessage = document.getElementById('input-alert');

    if(!inputs['city'].value.match(/[A-Za-z\ë\é\è\ê\ï\à\ù\ç\ü\ä\-]+$/g)) {
        error = 'veuillez renseigner un nom de ville valide';
    }

    if(!inputs['address'].value.match(/^[a-zA-Z0-9\s,'-.]*[/]{0,1}$/g)) {
        error = 'veuillez renseigner une adresse valide';
    }
    
    if(inputs['email'].value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) { 
        error = 'veuillez renseigner un email valide';
        console.log(inputs['email'].validity);
    }

    if(!inputs['firstName'].value.match(/[A-Za-z\ë\é\è\ê\ï\à\ù\ç\ü\ä\-]+$/g)) {
        error = 'veuillez renseigner un prénom valide';
    }

    if(!inputs['lastName'].value.match(/[A-Za-z\ë\é\è\ê\ï\à\ù\ç\ü\ä\-]+$/g)) {
        error = 'veuillez renseigner un nom valide';
    }

    if(error) {
        e.preventDefault();
        formMessage.textContent = error;
        formMessage.classList.add('alert', 'alert-danger');
    } else {
        e.preventDefault(); // à supprimer pour renvoyer versla page de confirmation de commande
        // vider le localstorage et la page actuelle 
        formMessage.textContent = 'commande envoyée';
    }
});
   











