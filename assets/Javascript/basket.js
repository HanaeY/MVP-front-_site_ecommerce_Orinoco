/* variables globales */
const basket = new Map(); 
let basketBtn = document.getElementById('clear-basket');
let productArray = [];

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

/* Envoi de la commande au serveur */ 

// Validation des données saisies dans le formulaire 

let firstNameInput = document.getElementById('firstName');
let lastNameInput = document.getElementById('lastName');
let emailInput = document.getElementById('email');
let addressInput = document.getElementById('address');
let cityInput = document.getElementById('city');
let alertContainer = document.getElementById('input-alert');

let firstName;
let lastName;
let city;

let unNom = 'un nom';
let unPrenom = 'un prénom';
let uneVille = 'un nom de ville';

const checkName = (field, item, errMsg) => {
    let alertMsg = document.createElement('p');
    alertContainer.appendChild(alertMsg);
    field.addEventListener('change', (event) => {
        if(event.target.value.match(/[A-Za-z\ë\é\è\ê\ï\à\ù\ç\ü\ä\-]+$/g)) {
            item = event.target.value;
            alertContainer.removeChild(alertMsg);
            console.log(item);
            return item;
        } else {
            field.value = '';
            alertMsg.classList.add('alert', 'alert-danger');
            alertMsg.textContent = 'Veuillez rentrer ' + errMsg + ' valide';
            checkName(field, item, errMsg)
        }
    });
    
};

const checkEmail = () => {
    let alertMsg = document.createElement('p');
    alertContainer.appendChild(alertMsg);
    emailInput.addEventListener('change', (event) => {
        if(event.target.value.match(/^[a-z0-9._%+-]{2,64}@[a-z0-9.-]{2,64}\.[a-z]{2,64}$/)) {
            let email = event.target.value;
            alertContainer.removeChild(alertMsg);
            return email;
        } else {
            emailInput.value = ''; 
            alertMsg.classList.add('alert', 'alert-danger');
            alertMsg.textContent = 'Veuillez rentrer un email valide';
            checkEmail()
        }
    });
}

const checkAddress = () => {
    let alertMsg = document.createElement('p');
    alertContainer.appendChild(alertMsg);
    addressInput.addEventListener('change', (event) => {
        if(event.target.value.match(/^[a-zA-Z0-9\s,'-.]*[/]{0,1}$/g)) {
            let address = event.target.value;
            alertContainer.removeChild(alertMsg);
            return address;
        } else {
            addressInput.value = ''; 
            alertMsg.classList.add('alert', 'alert-danger');
            alertMsg.textContent = 'Veuillez rentrer une adresse valide';
            checkAddress()
        }
    });
}

checkName(lastNameInput, lastName, unNom);
checkName(firstNameInput, firstName, unPrenom);
checkAddress ();
checkName(cityInput, city, uneVille);
checkEmail();

// Création de l'objet contact
// l’objet contact envoyé au serveur doit contenir les champs firstName,lastName,address,city, email
class Contact {
    constructor(firstName, lastName, address, city, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}

const sendOrder = () => {
    document.getElementById('submit').addEventListener('click', (event) => {
        event.preventDefault();
        if(firstNameInput.value  === '' || lastNameInput.value === '' || addressInput.value === '' || cityInput.value === '' || emailInput.value === '') {
            alert('formulaire non complété');
            sendOrder();
        } else {
            let contact = new Contact(firstNameInput.value, lastNameInput.value, addressInput.value, cityInput.value, emailInput.value);
            console.log(contact);
        }
    });
}


sendOrder()

   











