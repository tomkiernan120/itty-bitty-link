import { test, expect, type Page } from '@playwright/test';

// These tests register real users and create links in whichever database the dev server points at.
// Run them against a local or throwaway database, never production.

const password = 'correct-horse-battery';

const uniqueEmail = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

async function register(page: Page) {
  const email = uniqueEmail();

  // The register form submits through a client handler, so wait for hydration before using it
  await page.goto('/register', { waitUntil: 'networkidle' });
  await page.getByLabel('Name', { exact: true }).fill('E2E User');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20000 });

  return email;
}

async function createLink(page: Page, title: string, url: string) {
  await page.goto('/dashboard/create');
  await page.getByLabel('Title', { exact: true }).fill(title);
  await page.getByLabel('URL', { exact: true }).fill(url);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  const row = page.locator('tr', { hasText: title });
  await expect(row).toBeVisible();

  return row;
}

test('dashboard redirects to login when logged out', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/login/);
});

test('login with wrong credentials shows an error', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill(uniqueEmail());
  await page.getByLabel('Password', { exact: true }).fill('not-the-password');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Incorrect email or password.')).toBeVisible();
});

test('registered user can log in again', async ({ page, browser }) => {
  const email = await register(page);

  const context = await browser.newContext();
  const freshPage = await context.newPage();

  await freshPage.goto('/login');
  await freshPage.getByLabel('Email', { exact: true }).fill(email);
  await freshPage.getByLabel('Password', { exact: true }).fill(password);
  await freshPage.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(freshPage).toHaveURL(/\/dashboard$/, { timeout: 20000 });
  await context.close();
});

test('create, follow, edit and delete a link', async ({ page }) => {
  await register(page);

  const title = `Example ${Date.now()}`;
  const row = await createLink(page, title, 'https://example.com/a');
  const alias = (await row.locator('code').innerText()).trim();

  const redirect = await page.request.get(`/r/${alias}`, { maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers()['location']).toBe('https://example.com/a');

  await row.getByRole('link', { name: 'Edit' }).click();
  await page.getByLabel('Title', { exact: true }).fill(`${title} edited`);
  await page.getByLabel('URL', { exact: true }).fill('https://example.com/b');
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  const editedRow = page.locator('tr', { hasText: `${title} edited` });
  await expect(editedRow).toBeVisible();

  // The short link survives a URL change and points at the new destination
  await expect(editedRow.locator('code')).toHaveText(alias);
  const edited = await page.request.get(`/r/${alias}`, { maxRedirects: 0 });
  expect(edited.headers()['location']).toBe('https://example.com/b');

  page.on('dialog', (dialog) => dialog.accept());
  await editedRow.getByRole('button', { name: 'Delete' }).click();
  await expect(editedRow).toHaveCount(0);

  const deleted = await page.request.get(`/r/${alias}`, { maxRedirects: 0 });
  expect(deleted.status()).toBe(404);
});

test('unknown alias returns 404', async ({ page }) => {
  const response = await page.request.get('/r/this-alias-does-not-exist', { maxRedirects: 0 });

  expect(response.status()).toBe(404);
});

test('non-http URLs are rejected with an inline error', async ({ page }) => {
  await register(page);

  await page.goto('/dashboard/create');
  await page.getByLabel('Title', { exact: true }).fill('Bad scheme');
  await page.getByLabel('URL', { exact: true }).fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('URL must start with http:// or https://')).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/create$/);
});

test("a user cannot open another user's link for editing", async ({ page, browser }) => {
  await register(page);

  const row = await createLink(page, `Private ${Date.now()}`, 'https://example.com/private');
  const editHref = await row.getByRole('link', { name: 'Edit' }).getAttribute('href');
  expect(editHref).toBeTruthy();

  const context = await browser.newContext();
  const otherPage = await context.newPage();
  await register(otherPage);

  await otherPage.goto(editHref as string);
  await expect(otherPage.getByText('Uh oh! 404')).toBeVisible();
  await context.close();
});
