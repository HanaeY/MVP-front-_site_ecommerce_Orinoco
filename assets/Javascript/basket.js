/* variables globales */
const basket = new Map(); 
let storageContent;
let basketBtn = document.getElementById('clear-basket');
let displayedPrice;

/* vider le panier */

//vider le panier
basketBtn.addEventListener('click', () => {
    localStorage.removeItem('basket');
})

/* Afficher le résumé du panier */

// Récupérer le contenu du local storage (panier en cours)
storageContent = JSON.parse(localStorage.getItem('basket'));
console.log('contenu du local storage : ', storageContent);

// Ajouter dans la Map basket les éléments du storage en "fusionnant" les doublons 
const summarizeOrder = () => {
    for (let i = 0 ; i < storageContent.length ; i++) {
        let newId = storageContent[i].id + storageContent[i].color.replace(/\s/g, '');  
        let qty = parseInt(storageContent[i].quantity);
        if(basket.has(newId)) { 
            let currentQty = parseInt(basket.get(newId).quantity); 
            currentQty += qty;
            basket.delete(newId);
            let newItem = {id: storageContent[i].id, name: storageContent[i].name, color: storageContent[i].color, quantity: currentQty, price: storageContent[i].price};
            basket.set(newId, newItem);
        } else {
            basket.set(newId, storageContent[i]);
        }
    }
    console.log(basket);
};

// Afficher les données du résumé de commande sur la page 

const displayData = () => {
    for(let item of basket.values()){
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

const displayTotalPrice = () => {
    let totalPrice = 0;
    for (let item of basket.values()) {
        let itemPrice = item.quantity * item.price;
        totalPrice += itemPrice;
    }
    displayedPrice = document.createElement('p');
    document.getElementById('price-container').appendChild(displayedPrice);
    displayedPrice.textContent = 'Prix total à payer : ' + totalPrice + ' €';
    displayedPrice.classList.add('text-primary', 'text-center', 'border', 'border-primary');
}

summarizeOrder()
displayData()
displayTotalPrice()

/* Envoi de la commande au serveur */ 
// les produit sont envoyés sous forme d'un tableau contenant des strings product_id 

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
            let contact = new Contact(firstName, lastName, address, city, email);
            console.log(contact);
        }
    });
}


sendOrder()


/*
retourne: 
​
address: <input id="address" class="form-control" type="text" name="address" required="">
​
city: undefined
​
email: <input id="email" class="form-control" type="email" name="email" required="">
​
firstName: undefined
​
lastName: undefined
 */

   











