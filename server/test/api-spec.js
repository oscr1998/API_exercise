const request = require("supertest");
const expect = require("chai").expect
// import server
const server = require('../server');

describe('API server', () => {
    let api
    let testCat = {
        "name": "Bob",
        "age": 6
    }

    before(() => {
        // start the server and store it in the api variable
        api = server.listen(5000, () => console.log('Test server running on port 5000'))
    })

    after(done => {
        // close the server, then run done
        console.log('Gracefully stopping test server')
        api.close(done)
    })

    it('responds to get / with status 200', done => {
        request(api)
            .get('/')
            .expect(200, done)
    })

    it('responds to get /cats with status 200', done => {
        request(api)
            .get('/cats')
            .expect(200, done)
    })

    it('responds to post /cats with status 201', done => {
        request(api)
            .post('/cats')
            .send(testCat)
            .expect(201)
            .expect({id: 4, ...testCat}, done)
    })

    it('retrieves a cat by id', done => {
        request(api)
            .get('/cats/3')
            .expect(200)
            .expect({id: 3, name: "Rumble", age: 12}, done)
    })

    it('responds to delete /cats/:id with status 204', async () => {
        await request(api)
            .delete('/cats/4')
            .expect(204)

        const updatedCats = await request(api).get('/cats')
         
        expect(updatedCats.body).to.have.length(3);
    })

    it('responds to non existing paths with 404', done => {
        request(api)
            .get('/no')
            .expect(404, done)
    })

    it('responds to invalid method request with 405', done => {
        request(api)
            .post('/')
            .expect(405, done)
    })
})