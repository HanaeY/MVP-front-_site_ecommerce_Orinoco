/* variables globales */
const basket = new Map(); 

/* Bouton 'vider le panier" */
document.getElementById('clear-basket').addEventListener('click', () => {
    localStorage.removeItem('basket');
})

/* Afficher le résumé du panier */

// Récupérer le contenu du local storage (panier en cours)
let storageContent = JSON.parse(localStorage.getItem('basket'));
console.log('contenu du local storage : ', storageContent);

// Ajouter dans la map basket les éléments du storage en "fusionnant" les doublons 
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
    //console.log('test', basket.get('5beaa8bf1c9d440000a57d94Palebrown').name); // affiche test Arnold 
    //console.log('test2', basket.get(key[2]).name); // erreur : key is not defined 
    //console.log('test3', basket.get('').name); 
};

// Afficher les données du résumé de commande sur la page 

const displayData = () => {
    for(let item of basket.values()){
        console.log(item.name);
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

/*
const displayData = () => {
    for(let i = 0 ; i < basket.length ; i++) {
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
        name.textContent = basket.get(key[i]).name;
        color.textContent = basket.get(key[i]).color;
        quantity.textContent = basket.get(key[i]).quantity;
        price.textContent = basket.get(key[i]).price;
    }
};*/

summarizeOrder()
displayData()


