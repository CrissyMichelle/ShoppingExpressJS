const fakeDb = require('./fakeDb');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/items', (request, response) => {
    let itemsArr = [];

    for (let i = 0; i < fakeDb.length; i++) {
        let item = {};
    
        item["name"] = fakeDb[i].name;
        item["price"] = fakeDb[i].price;

        itemsArr.push(item);
    }
    
    response.send({
        itemsArr
    });
});

app.post('/items', (request, response) => {
    let addToShoppingList = request.body;

    fakeDb.push(addToShoppingList);

    response.send({
        added: addToShoppingList
    });
});

app.get('/items/:name', (request, response) => {
    let singleItemName = request.params.name;
    let item = fakeDb.find(dbItem => dbItem.name === singleItemName);

    if (item) {
        response.send({
            item
        });
    } else {
        response.status(404).send({
            message: 'Item not found'
        });
    }
});

app.patch('/items/:name', (request, response) => {
    let singleItemName = request.params.name;
    let item = fakeDb.find(dbItem => dbItem.name === singleItemName);

    if (item) {
        let updatedValues = request.body;

        if (updatedValues.name) {
            item.name = updatedValues.name;
        }
        if (updatedValues.price) {
            item.price = updatedValues.price;
        }

        response.send({
            updated: item
        });
    } else {
        response.status(404).send({
            message: 'Item not found'
        });
    }
});

app.delete('/items/:name', (request, response) => {
    let singleItemName = request.params.name;
    let itemIndex = fakeDb.findIndex(dbItem => dbItem.name === singleItemName);

    if (itemIndex !== -1) {
        fakeDb.splice(itemIndex, 1);
        response.send({
            message: 'Deleted'
        });
    } else {
        response.status(404).send({
            message: 'Item not found'
        });
    }
});

const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})

module.exports = { app, server };