const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const helpers = require('../../utils/helpers');
const jwt = require('jsonwebtoken');

describe('Users Endpoints', () => {

    it('should not fetch users without valid credentials', async () => {
        const res = await request(app)
            .get('/api/users');
        expect(res.statusCode).toEqual(400);
    });

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/authentication/sign-up')
            .send({
                email: 'test12345@testing.com',
                password: 'iamtesting12345',
                first_name: 'testinghere',
                last_name: 'tester'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toBeTruthy();
        let user = await User.findByPk(res.body.id);
        await user.destroy();
    });

    it('should generate a correct JWToken', async () => {
        const passwordHash = User.hashPassword('unitpassword');
        const user = User.build({
            id:99999,
            email: 'test@test.nl',
            password: passwordHash.hash.toString('hex'),
            password_salt: passwordHash.salt,
            admin: false
        });

        const token = user.generateJWToken();
        expect(token).not.toBeNull();

        const decodedToken = jwt.decode(token);

        expect(user.id).toEqual(decodedToken.id);
        expect(decodedToken.id).toBeTruthy();
    });

    it('should hash password correctly', async () => {
        const password = 'unitpassword';
        const passwordHash = User.hashPassword(password);
        const user = User.build({
            id:999999,
            email: 'test@test.nl',
            password: passwordHash.hash.toString('hex'),
            password_salt: passwordHash.salt,
            admin: false
        });

        const passwordMatches = helpers.isPasswordCorrect(password, user.password, user.password_salt);
        expect(passwordMatches).not.toBeNull();
        expect(passwordMatches).toBe(true);
    });
    
    it('shouldn\'t be authorized', async () => {
        const notAuthorizedId = 0;
        const password = 'unitpassword';
        const passwordHash = User.hashPassword(password);
        const user = User.build({
            id:9999,
            email: 'test@test.nl',
            password: passwordHash.hash.toString('hex'),
            password_salt: passwordHash.salt,
            admin: false
        });

        const token = user.generateJWToken();
        expect(token).not.toBeNull();

        const isAuthorized = helpers.isCookieAuthorized(notAuthorizedId, token);
        expect(isAuthorized).not.toBeNull();
        expect(isAuthorized).toBe(false);
    });

    it('should be authorized', async () => {
        const authorizedId = 9999;
        const password = 'unitpassword';
        const passwordHash = User.hashPassword(password);
        const user = User.build({
            id:authorizedId,
            email: 'test@test.nl',
            password: passwordHash.hash.toString('hex'),
            password_salt: passwordHash.salt,
            admin: false
        });

        const token = user.generateJWToken();
        expect(token).not.toBeNull();

        const isAuthorized = helpers.isCookieAuthorized(authorizedId, token);
        expect(isAuthorized).not.toBeNull();
        expect(isAuthorized).toBe(true);
    });

});
