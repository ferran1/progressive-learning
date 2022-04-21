const request = require('supertest');
const app = require('../../server');

describe('Learning-unit Endpoints', () => {

    it('should create a new learning-unit', async () => {
        const res = await request(app)
            .post('/api/learningUnits')
            .send({
                title: 'new learning-unit',
                completed: false,
                summary: ''
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toBeTruthy();
    });
});
