const request = require('supertest');
const app = require('../../server');

describe('Subjects Endpoints', () => {

    it('should fetch all subjects ', async () => {
        const res = await request(app)
            .get('/api/subjects');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });


});
