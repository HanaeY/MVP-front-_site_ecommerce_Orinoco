// variables principales

let basket;
let basketBtn = document.getElementById('clear-basket');
let products = [];
let contact = {};
let submitBtn = document.getElementById('submit');

class Contact {
    constructor(firstName, lastName, address, city, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

/* Afficher le panier */

// désactiver le formulaire de contact

const disableForm = (data) => {
    document.getElementById('lastName').disabled = data;
    document.getElementById('firstName').disabled = data;
    document.getElementById('email').disabled = data;
    document.getElementById('address').disabled = data;
    document.getElementById('city').disabled = data;
    document.getElementById('submit').disabled = data;
};

// Récupérer le contenu du local storage

const getStorageData = () => {
    let basketArray = JSON.parse(localStorage.getItem('basket'));
    basket = new Map(basketArray);
    return basket;
};

// Afficher les données du résumé de commande sur la page 

const displayData = (data) => {
    let totalPrice = 0;
    for(let item of data.values()){
        let newLine = document.createElement('tr');
        document.getElementById('table').appendChild(newLine);

        let name = document.createElement('td');
        newLine.appendChild(name);
        name.textContent = item.name;

        let color = document.createElement('td');
        newLine.appendChild(color);
        color.textContent = item.color;

        let quantityBox = document.createElement('td');
        newLine.appendChild(quantityBox);
        let quantity = document.createElement('select');
        quantityBox.appendChild(quantity);

        let optionZero = document.createElement('option');
        optionZero.value = 0;
        optionZero.textContent = '0';
        quantity.appendChild(optionZero);

        let optionOne = document.createElement('option');
        optionOne.value = 1;
        optionOne.textContent = '1';
        quantity.appendChild(optionOne);

        let optionTwo = document.createElement('option');
        optionTwo.value = 2;
        optionTwo.textContent = '2';
        quantity.appendChild(optionTwo);

        let optionThree = document.createElement('option');
        optionThree.value = 3;
        optionThree.textContent = '3';
        quantity.appendChild(optionThree);

        let optionFour = document.createElement('option');
        optionFour.value = 4;
        optionFour.textContent = '4';
        quantity.appendChild(optionFour);

        let optionFive = document.createElement('option');
        optionFive.value = 5;
        optionFive.textContent = '5';
        quantity.appendChild(optionFive);

        let optionSix = document.createElement('option');
        optionSix.value = 6;
        optionSix.textContent = '6';
        quantity.appendChild(optionSix);

        let optionSeven = document.createElement('option');
        optionSeven.value = 7;
        optionSeven.textContent = '7';
        quantity.appendChild(optionSeven);

        let optionEight = document.createElement('option');
        optionEight.value = 8;
        optionEight.textContent = '8';
        quantity.appendChild(optionEight);

        let optionNine = document.createElement('option');
        optionNine.value = 9;
        optionNine.textContent = '9';
        quantity.appendChild(optionNine);

        let optionTen = document.createElement('option');
        optionTen.value = 10;
        optionTen.textContent = '10';
        quantity.appendChild(optionTen);

        quantity.value = item.quantity;

        let price = document.createElement('td');
        newLine.appendChild(price);
        price.textContent = item.price * item.quantity + ' €';

        // écoute du changement de quantité d'un produit
        quantity.addEventListener('input', (event) => {
            let newQuantity = event.target.value;
            item.quantity = newQuantity;

            // changer la valeur dans le panier actuel
            let newObject = {id: item.id, name: item.name, color: item.color, quantity: item.quantity, price: item.price};
            let newKey = item.id + item.color.replace(/\s/g, '');
            basket.delete(newKey);
            basket.set(newKey, newObject);

            // modifier le local storage
            localStorage.setItem('basket', JSON.stringify(Array.from(basket)));

            // changer prix de la ligne 
            price.textContent = item.price * item.quantity + ' €';

            // changer le prix total
            displayTotalPrice(data);

            // modifier le tableau products
            products = [];
            buildOrderArray(data);
            
            // désactiver le formulaire si le panier est vidé 
            if(products.length == 0) {
                clearBasket();
            }
        });
    }
};

const displayTotalPrice = (data) => {
    let totalPrice = 0;
    for (let item of data.values()) {
        let itemPrice = item.quantity * item.price;
        totalPrice += itemPrice;
    }
    // créer l'élément prix 
    if(document.getElementById('total-price') == null) {
        let displayedPrice = document.createElement('p');
        displayedPrice.setAttribute('id', 'total-price');
        displayedPrice.classList.add('text-primary', 'text-center', 'border', 'border-primary', 'container');
        displayedPrice.style.maxWidth = '300px';
        document.getElementById('price-container').appendChild(displayedPrice);
    }

    document.getElementById('total-price').textContent = 'Prix total à payer : ' + totalPrice + ' €';
};

// Construire le tableau produit à envoyer au serveur

const buildOrderArray = (data) => {
    if(data != null) {
        for(let item of data.values()) {
            let itemId = item.id;
            let itemQuantity = parseInt(item.quantity);
            for(let i = 0 ; i < itemQuantity ; i++) {
                products.push(itemId);
            }
        }

        disableForm(false);
    }
};

// Appel de la fonction de récupération/affichage des données du panier 

const processBasket = () => {
    basket = getStorageData();
    if(basket != null) {
        displayData(basket)
        displayTotalPrice(basket)
        buildOrderArray(basket)
    } else {
        disableForm(true);
        document.getElementById('basket-info').textContent = 'Votre panier est vide';
        basketBtn.disabled = true;
    }
};

processBasket()

/* vider le panier */

// Vider le résumé du panier 

const clearBasketSummary = () => {
    document.getElementById('price-container').textContent = '';
    document.getElementById('table').textContent = '';
    document.getElementById('basket-info').textContent = 'Votre panier est vide';
};

// Vider le panier 

const clearBasket = () => {
    localStorage.removeItem('basket');
    products = [];
    clearBasketSummary();
    disableForm(true);
    basketBtn.disabled = true;
};

basketBtn.addEventListener('click', clearBasket);

/* Envoi de la commande */

 const submit = () => {
    document.forms['order-form'].addEventListener('submit', (e) => {
        let error;
        let inputs = this;
        let formMessage = document.getElementById('input-alert');

        //validation des données saisies
    
        if(!inputs['city'].value.match(/[A-Za-z\ë\é\è\ê\ï\à\ù\ç\ü\ä\-]+$/g)) {
            error = 'veuillez renseigner un nom de ville valide';
        }
    
        if(!inputs['address'].value.match(/^[a-zA-Z0-9\s,'-.]*[/]{0,1}$/g)) {
            error = 'veuillez renseigner une adresse valide';
        }
        
        if(inputs['email'].value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) { 
            error = 'veuillez renseigner un email valide';
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
            e.preventDefault();
            contact = new Contact(inputs['firstName'].value, inputs['lastName'].value, inputs['address'].value, inputs['city'].value, inputs['email'].value);

            post()
        }
    });
 };

 // Envoi de la commmande au serveur 

 const post = async () => {
    try {
        let response = await fetch('http://localhost:3000/api/teddies/order', {
            method: 'POST',
            headers: {'content-type': 'application/json;charset=utf-8'},
            body: JSON.stringify({contact, products}),
        });
        if(response.ok) {
            let orderConfirmation = await response.json();
            confirmation(orderConfirmation);

        } else {
            alert('oups, une erreur serveur a été rencontrée (statut ' + response.status + ')');
        }
    } catch(err) {
        alert('oups, une erreur est survenue, veuillez nous contacter si cela persiste');
    }
 };

 // Renvoi vers la page confirmation de commande

 const confirmation = (data) => {
    localStorage.setItem('orderConfirmation', JSON.stringify(data));
    clearBasket()
    window.location.replace('confirmation.html');
 };

 /// Appel de la fonction d'envoi de la commande 
   
 submit()











