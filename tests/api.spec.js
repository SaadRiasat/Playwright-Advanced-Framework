/**
 * api.spec.js
 * Comprehensive REST API Testing Suite using Playwright's APIRequestContext fixture.
 * Includes:
 *  - GET (List & Single Resource)
 *  - POST (Create Resource)
 *  - PUT / PATCH (Update Resource)
 *  - DELETE (Remove Resource)
 *  - Negative & Error Status code testing (404 Not Found)
 *  - Structured test.step() and Allure report attachments for request/response payloads
 */
import { test, expect } from '@playwright/test';

test.describe('API Testing Suite — REST API with Playwright & Allure', () => {
  const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('GET /posts — Fetch all posts and validate schema', async ({ request }) => {
    let response;
    let responseBody;

    await test.step('Send GET request to /posts', async () => {
      response = await request.get(`${API_BASE_URL}/posts`);
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      responseBody = await response.json();
    });

    await test.step('Validate response array and attach data to report', async () => {
      expect(Array.isArray(responseBody)).toBeTruthy();
      expect(responseBody.length).toBeGreaterThan(0);
      expect(responseBody[0]).toHaveProperty('id');
      expect(responseBody[0]).toHaveProperty('title');
      expect(responseBody[0]).toHaveProperty('body');

      await test.info().attach('GET /posts Response Sample', {
        body: JSON.stringify(responseBody.slice(0, 3), null, 2),
        contentType: 'application/json',
      });
    });
  });

  test('GET /posts/1 — Fetch single post by ID', async ({ request }) => {
    let response;
    let post;

    await test.step('Send GET request to /posts/1', async () => {
      response = await request.get(`${API_BASE_URL}/posts/1`);
      expect(response.status()).toBe(200);
      post = await response.json();
    });

    await test.step('Validate post fields and ID', async () => {
      expect(post.id).toBe(1);
      expect(typeof post.title).toBe('string');
      expect(typeof post.userId).toBe('number');

      await test.info().attach('GET /posts/1 Response', {
        body: JSON.stringify(post, null, 2),
        contentType: 'application/json',
      });
    });
  });

  test('POST /posts — Create a new post', async ({ request }) => {
    const newPostData = {
      title: 'Playwright API Automation',
      body: 'Testing REST API using Playwright and generating Allure reports',
      userId: 101,
    };

    let response;
    let createdPost;

    await test.step('Attach request payload to Allure report', async () => {
      await test.info().attach('POST /posts Request Payload', {
        body: JSON.stringify(newPostData, null, 2),
        contentType: 'application/json',
      });
    });

    await test.step('Send POST request to /posts with payload', async () => {
      response = await request.post(`${API_BASE_URL}/posts`, {
        data: newPostData,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      expect(response.status()).toBe(201);
      createdPost = await response.json();
    });

    await test.step('Validate created post response fields', async () => {
      expect(createdPost.title).toBe(newPostData.title);
      expect(createdPost.body).toBe(newPostData.body);
      expect(createdPost.userId).toBe(newPostData.userId);
      expect(createdPost).toHaveProperty('id');

      await test.info().attach('POST /posts Response', {
        body: JSON.stringify(createdPost, null, 2),
        contentType: 'application/json',
      });
    });
  });

  test('PUT /posts/1 — Update an existing post', async ({ request }) => {
    const updateData = {
      id: 1,
      title: 'Updated Post Title with Playwright',
      body: 'Updated body content for test verification',
      userId: 1,
    };

    let response;
    let updatedPost;

    await test.step('Send PUT request to /posts/1', async () => {
      response = await request.put(`${API_BASE_URL}/posts/1`, {
        data: updateData,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      expect(response.status()).toBe(200);
      updatedPost = await response.json();
    });

    await test.step('Verify update result and attach response to Allure', async () => {
      expect(updatedPost.title).toBe(updateData.title);
      expect(updatedPost.body).toBe(updateData.body);

      await test.info().attach('PUT /posts/1 Response', {
        body: JSON.stringify(updatedPost, null, 2),
        contentType: 'application/json',
      });
    });
  });

  test('DELETE /posts/1 — Delete a post', async ({ request }) => {
    let response;

    await test.step('Send DELETE request to /posts/1', async () => {
      response = await request.delete(`${API_BASE_URL}/posts/1`);
      expect(response.status()).toBe(200);
    });

    await test.step('Verify deletion status and attach confirmation', async () => {
      await test.info().attach('DELETE /posts/1 Result', {
        body: JSON.stringify({ status: response.status(), statusText: response.statusText() }, null, 2),
        contentType: 'application/json',
      });
    });
  });

  test('GET /posts/999999 — Negative test for non-existent resource (404)', async ({ request }) => {
    let response;

    await test.step('Send GET request for non-existent post ID', async () => {
      response = await request.get(`${API_BASE_URL}/posts/999999`);
    });

    await test.step('Assert response status is 404 Not Found', async () => {
      expect(response.status()).toBe(404);

      await test.info().attach('404 Not Found Verification', {
        body: JSON.stringify({ status: response.status(), ok: response.ok() }, null, 2),
        contentType: 'application/json',
      });
    });
  });
});
