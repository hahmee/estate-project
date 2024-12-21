import request from 'supertest';
import app from '../app.js';
import {expect} from 'chai';

describe('GET /', () => {
    it('should return hello world', async () => {
        const res = await request(app).get('/api/posts/66b3334d522826a49ccd97f0');

        // Chai의 expect로 검증
        expect(res.body).to.have.property('address', '대한민국 강원도 춘천시 중앙로 강원도청');
        expect(res.body).to.have.property('bathroom', 12);
    });
})