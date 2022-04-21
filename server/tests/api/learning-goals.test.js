const request = require('supertest');
const app = require('../../server');

describe('Learning-goal Endpoints', () => {

    it('should create a new learning-goal', async () => {
        const res = await request(app)
            .post('/api/learning-goals')
            .send({
                goal: 'Understand the principles of unit testing',
                visibility: 'PRIVATE',
                description: 'Principles of unit testing are a set of rules ' +
                    'that define how to write high quality unit-tests.',
                progress: 0,
                learningUnits: [],
                subject: {subject: {id: 1}},
                user: {user: {id: 2}}

            });
        expect(res.statusCode).toEqual(201);
    });

    it('should fetch learning-goals', async () => {
        const res = await request(app)
            .get('/api/learning-goals');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });



});
