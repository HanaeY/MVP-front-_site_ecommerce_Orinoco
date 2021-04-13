// variables globales
const basket = new Map(); 

// Bouton 'vider le panier"
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
            let newItem = {id: storageContent[i].id, color: storageContent[i].color, quantity: currentQty};
            basket.set(newId, newItem);
        } else {
            basket.set(newId, storageContent[i]);
        }
    }
    console.log(basket);
};

summarizeOrder()


