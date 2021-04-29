
/*Affichage dynamique du produit et ajout dans le localstorage */

// variables principales 
let teddyId;
let quantity = parseInt(document.getElementById('selected-teddy-quantity').value);
let basket;

class BasketItem {
    constructor(id, name, color, quantity, price) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.quantity = quantity;
        this.price = price/100;
    }
};

// Récupération de l'id produit avec les query parameters

const getTeddyId = () => {
    const urlParam = window.location.search; 
    teddyId = urlParam.replace('?id=', ''); 
    return teddyId
};

// Fonction principale

const getTeddyData = async () => {
    try {
        var response = await fetch('http://localhost:3000/api/teddies/' + teddyId)
        if(response.ok) {
            var teddyData = await response.json();
            displayTeddyData(teddyData);
            updatePrice(teddyData);
            addToBasket(teddyData);
        } else {
            alert('oups, une erreur serveur a été rencontrée (statut ' + response.status + ')');
        }
    } catch(err) {
        alert('oups, une erreur est survenue, veuillez nous contacter si cela persiste');
    }
};

// Affichage des données du Teddy sur la page 

const displayTeddyData = (data) => {
    document.getElementById('selected-teddy-name').textContent = data.name;
    document.getElementById('selected-teddy-description').textContent = data.description;
    document.getElementById('selected-teddy-price').textContent = 'Prix total : ' + data.price / 100 + '€';
    let image = document.createElement('img');
    document.getElementById('image-container').appendChild(image);
    image.classList.add('card-img');
    image.setAttribute('src', data.imageUrl);
    image.setAttribute('alt', 'photo de ' + data.name);
    image.setAttribute('href', 'product.html?id=' + data._id);
    
    for(i = 0 ; i < data.colors.length ; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', data.colors[i]);
        option.textContent = data.colors[i];
        document.getElementById('selected-teddy-colors').appendChild(option);
    }
};

// Mettre le prix à jour en fonction de la quantité saisie 

const updatePrice = (data) => {
    totalPrice = data.price / 100;
    document.getElementById('selected-teddy-quantity').addEventListener('input', (event) => {
        quantity = event.target.value;
        totalPrice = data.price * quantity / 100;
        document.getElementById('selected-teddy-price').textContent = 'Prix de la sélection : ' + totalPrice + '€';
    });
};

// Ajouter le·s produit·s dans le localstorage 

const returnInfo = (data) => {
    let info = document.createElement('div');
    document.getElementById('info').appendChild(info);
    info.classList.add('alert', 'alert-success');

    if(data == 1) {
        info.textContent = 'Vous avez ajouté 1 produit à votre panier';
    } else {
        info.textContent = 'Vous avez ajouté ' + data + ' produits à votre panier';
    }
};

const addToBasket = (data) => {
    document.getElementById('add-to-basket').addEventListener('click', (event) => {
        event.preventDefault();

        // élément à ajouter au local storage
        let color = document.getElementById('selected-teddy-colors').value;
        let item = new BasketItem(teddyId, data.name, color, quantity, data.price);
        let key = teddyId + color.replace(/\s/g, '');

        // récupérer le contenu du local storage
        basketArray = JSON.parse(localStorage.getItem('basket'));

        if(basketArray == null) {
            basket = new Map();
        } else {
            // reconvertir le tableau en map
            basket = new Map(basketArray);
        }

        if(basket.has(key)) {
            let storedQuantity = parseInt(basket.get(key).quantity); 
            newQuantity = quantity + storedQuantity;
            item = new BasketItem(teddyId, data.name, color, newQuantity, data.price);
            basket.delete(key);
            basket.set(key, item);
        } else {
            basket.set(key,item);
        }
        localStorage.setItem('basket', JSON.stringify(Array.from(basket)));

        returnInfo(quantity);
    });
};

getTeddyId()
getTeddyData()





