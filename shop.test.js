const request = require('supertest');
const { app, server } = require('./app');
const fakeDb = require('./fakeDb');

afterAll(done => {
    server.close(done);
});

describe('GET /items', () => {
    it('should return a list of items', async () => {
        const response = await request(app)
            .get('/items')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(Array.isArray(response.body.itemsArr)).toBe(true);
    });
});

describe('POST /items', () => {
    it('should add a new item and return it', async () => {
        const newItem = {
            name: "NewItem",
            price: 100
        };

        const response = await request(app)
            .post('/items')
            .send(newItem)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.added).toEqual(newItem);
    })
})

describe('GET /items/:name', () => {
    beforeEach(() => {
        fakeDb.push({
            name: 'ExampleItem',
            price: 100
        });
    });

    afterEach(() => {
        fakeDb.length = 0;
    });

    describe('GET /items/:name', () => {
        it('should return an item by its name', async () => {
            const itemName = "ExampleItem";

            const response = await request(app)
                .get(`/items/${itemName}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.item).toEqual({
                name: itemName,
                price: 100
            });
        });

        it('should return 404 for an item not found', async () => {
            const nonExistentItem = 'NonExistent';

            const response = await request(app)
                .get(`/items/${nonExistentItem}`)
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body.message).toEqual('Item not found');
        });
    });

    describe('PATCH /items/:name', () => {
        beforeEach(() => {
            fakeDb.push({
                name: 'OriginalItem',
                price: 100
            });
        });

        afterEach(() => {
            fakeDb.length = 0;
        });

        it('should update an existing item and return the updated item', async () => {
            const updatedData = {
                name: 'NewItemName',
                price: 150
            };

            const response = await request(app)
                .patch('/items/OriginalItem')
                .send(updatedData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.updated).toEqual(updatedData);
            });

        it('should return 404 if the item does not exist', async () => {
            const updatedData = {
                name: 'NonExistentItem',
                price: 150
            };

            const response = await request(app)
                .patch('/items/NonExistentItem')
                .send(updatedData)
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body.message).toEqual('Item not found');
        });
    });
})