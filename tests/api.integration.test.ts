import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';

describe('API integration (basico)', () => {
  it('rechaza registro invalido por validacion AJV', async () => {
    const response = await request(app).post('/auth/register').send({
      nombre: 'Y',
      email: 'email-invalido',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
  });

  it('rechaza acceso a /tasks sin token', async () => {
    const response = await request(app).get('/tasks');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status', 'error');
  });
});
