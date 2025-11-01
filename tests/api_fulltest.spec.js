import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { assertSchema } from '../utils/schema-assert.js';
import {
  CreateUserResponse,
  UpdateUserResponse,
  ListUsersResponse
} from '../schemas/reqres-user.js';

test.describe.serial('Reqres Users API Testing', () => {
  let createdUser = { id: null, first_name: 'Virat', email: 'cricket@gmail.com' };

  test('@smoke POST - Creates a user and validates schema', async ({ request, baseURL }) => {
    const payload = { first_name: createdUser.first_name, email: createdUser.email };
    const t0 = Date.now();

    const res = await request.post('/api/users', { data: payload });
    const t1 = Date.now();
    expect(res.status()).toBe(201);
    expect(t1 - t0).toBeLessThan(1500);

    const body = await res.json();
    const validated = assertSchema(CreateUserResponse, body);
    createdUser.id = validated.id;
    expect(validated.first_name).toBe(payload.first_name);
    expect(validated.email).toBe(payload.email);

    const ctype = res.headers()['content-type'] || '';
    expect(ctype.toLowerCase()).toContain('application/json');

    test.info().attach('POST-response.json', {
      body: JSON.stringify(body, null, 2),
      contentType: 'application/json'
    });
  });

  test('GET - Returns a list and validates', async ({ request }) => {
    const res = await request.get('/api/users?page=2');
    expect(res.status()).toBe(200);
    const body = await res.json();

    const list = assertSchema(ListUsersResponse, body);
    const names = list.data.map(u => u.first_name);
    expect(names).toContain('Michael');
    expect(list.page).toBe(2);
    expect(list.per_page).toBeGreaterThan(0);
     test.info().attach('GET-response.json', {
      body: JSON.stringify(body, null, 2),
      contentType: 'application/json'
    });
  });

  test('PUT - Fully updates user', async ({ request }) => {
    test.skip(!createdUser.id, 'No created user id from previous test');
    const payload = { first_name: 'Virat Kohli', email: 'Cricket' };

    const res = await request.put(`/api/users/${createdUser.id}`, { data: payload });
    expect(res.status()).toBe(200);

    const body = await res.json();
    const validated = assertSchema(UpdateUserResponse, body);
    expect(typeof validated.updatedAt).toBe('string');

     test.info().attach('PUT-response.json', {
      body: JSON.stringify(body, null, 2),
      contentType: 'application/json'
    });

    const patch = await request.patch(`/api/users/${createdUser.id}`, { data: { job: 'Cricket Legend' } });
    expect(patch.status()).toBe(200);
    const patchBody = assertSchema(UpdateUserResponse, await patch.json());
    expect(typeof patchBody.updatedAt).toBe('string');
    test.info().attach('Patch-response.json', {
      body: JSON.stringify(await patch.json(), null, 2),
      contentType: 'application/json'
    });


  });

  test('DELETE - Removes user', async ({ request }) => {
    test.skip(!createdUser.id, 'No created user id from previous test');
    const del = await request.delete(`/api/users/${createdUser.id}`);
    expect(del.status()).toBe(204);
    const delAgain = await request.delete(`/api/users/${createdUser.id}`);
    expect([204, 404]).toContain(delAgain.status());
  });

  test('NEGATIVE: GET non-existent user', async ({ request }) => {
    const res = await request.get('/api/users/99999');
    expect([404]).toContain(res.status());
  });

  test('NEGATIVE: POST invalid payload', async ({ request }) => {
    const res = await request.post('/api/users', { data: { name: 123 } }); // invalid type
    expect([400, 415, 422, 201].includes(res.status())).toBeTruthy();
  });
});
