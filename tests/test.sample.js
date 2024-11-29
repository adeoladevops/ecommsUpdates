const request = require('supertest');
const app = require('../server'); // Adjust this path to point to your server file

describe('GET /', () => {
	  it('should return a 200 status', async () => {
		      const response = await request(app).get('/');
		      expect(response.statusCode).toBe(200);
		    });
});

