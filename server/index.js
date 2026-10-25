const crypto = require('node:crypto');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = Number(process.env.PORT || 3000);
const sessionCookieName = 'fd_admin_session';
const sessionDurationMs = 8 * 60 * 60 * 1000;
const allowedFolders = new Set(['messages', 'blogs', 'discipler-avatars']);
const collectionIds = {
  messages: 'family-discipleship/messages.json',
  blogs: 'family-discipleship/blogs.json',
  disciplers: 'family-discipleship/disciplers.json'
};

const defaults = {
  messages: [
    { id: 1, disciplerId: 1, disciplerName: 'Glory Adekunle Opekun', title: 'Welcome to Discipleship', content: 'Welcome everyone to our discipleship program. This is our first message to get started on this journey together.', date: '2026-01-15T00:00:00.000Z' },
    { id: 2, disciplerId: 1, disciplerName: 'Glory Adekunle Opekun', title: 'Weekly Devotional - Faith', content: 'This week we focus on faith. Hebrews 11:1 tells us that faith is the substance of things hoped for, the evidence of things not seen.', date: '2026-01-22T00:00:00.000Z' },
    { id: 3, disciplerId: 1, disciplerName: 'Glory Adekunle Opekun', title: 'Prayer Requests', content: 'Please share your prayer requests for this week. We will pray together as a community.', date: '2026-01-29T00:00:00.000Z' },
    { id: 4, disciplerId: 2, disciplerName: 'Pastor Simon poopola', title: 'Bible Study: The Book of James', content: 'Starting next week, we will begin a study on the Book of James. Please read chapter 1 before our first session.', date: '2026-01-18T00:00:00.000Z' },
    { id: 5, disciplerId: 3, disciplerName: 'Pastor Kehinde Ogunwole', title: 'Community Outreach', content: 'We are planning a community outreach event next month. Volunteers needed!', date: '2026-02-01T00:00:00.000Z' },
    { id: 6, disciplerId: 4, disciplerName: 'Pastor Shina', title: 'Youth Night: Identity in Christ', content: 'Join us as we explore what the Bible says about our identity in Christ. Open to all teens and young adults.', date: '2026-02-10T00:00:00.000Z' }
  ],
  blogs: [
    { id: 1, title: 'The Power of Prayer in Daily Life', content: 'Prayer is not just a ritual but a powerful connection with God. When we pray consistently, we align our hearts with His will and experience His peace that surpasses all understanding.', author: 'Pastor John Smith', date: '2026-01-10T00:00:00.000Z' },
    { id: 2, title: 'Walking in Faith Through Uncertainty', content: 'Life often brings unexpected challenges. Walking in faith means trusting God even when we cannot see the path ahead. Abraham\'s journey teaches us that faith is obedience without full knowledge.', author: 'Sarah Williams', date: '2026-01-20T00:00:00.000Z' },
    { id: 3, title: 'Building Strong Family Foundations', content: 'A strong family is built on love, respect, and shared values. Regular family devotions, open communication, and serving together create bonds that withstand life\'s storms.', author: 'David Brown', date: '2026-02-01T00:00:00.000Z' }
  ],
  disciplers: [
    { id: 1, name: 'Glory Adekunle Opekun', email: 'glory@example.com', phone: '+234-801-234-5678', avatar: '/glory adekunle opekun/Glory Adekunle Opekun.jpeg' },
    { id: 2, name: 'Pastor Simon poopola', email: 'simon@example.com', phone: '+234-802-345-6789', avatar: '/Popoola Simon.jpeg' },
    { id: 3, name: 'Pastor Kehinde Ogunwole', email: 'kehinde@example.com', phone: '+234-803-456-7890', avatar: '/kehinde ogunwole.jpeg' },
    { id: 4, name: 'Pastor Shina', email: 'shina@example.com', phone: '+234-804-567-8901', avatar: '/Adeshina.jpeg' }
  ]
};

const cache = new Map();
const writes = new Map();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

function authenticationConfigurationError() {
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return 'Set ADMIN_PASSWORD and SESSION_SECRET in the server environment.';
  }
  return null;
}

function cloudinaryConfigurationError() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return 'Set the Cloudinary cloud name, API key, and API secret in the server environment.';
  }
  return null;
}

function signSession(payload) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function readCookie(request, name) {
  const cookieHeader = request.headers.cookie || '';
  for (const cookie of cookieHeader.split(';')) {
    const separator = cookie.indexOf('=');
    if (separator < 0) continue;
    if (cookie.slice(0, separator).trim() === name) {
      return cookie.slice(separator + 1).trim();
    }
  }
  return null;
}

function hasAdminSession(request) {
  if (!process.env.SESSION_SECRET) return false;
  const token = readCookie(request, sessionCookieName);
  if (!token) return false;
  const [expiresText, signature, extra] = token.split('.');
  if (!expiresText || !signature || extra !== undefined) return false;
  const expiresAt = Number(expiresText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;
  return safeEqual(signature, signSession(expiresText));
}

function requireAdmin(request, response, next) {
  if (hasAdminSession(request)) return next();
  response.status(401).json({ error: 'Admin session required.' });
}

function requireCloudinary(response) {
  const error = cloudinaryConfigurationError();
  if (error) {
    response.status(503).json({ error });
    return false;
  }
  return true;
}

function isNotFound(error) {
  return error.http_code === 404 || error.error?.http_code === 404;
}

async function loadCollection(name) {
  if (cache.has(name)) return cache.get(name);
  const publicId = collectionIds[name];
  try {
    const resource = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
    const response = await fetch(resource.secure_url);
    if (!response.ok) throw new Error(`Cloudinary JSON asset fetch failed (${response.status}).`);
    const records = await response.json();
    if (!Array.isArray(records)) throw new Error(`Cloudinary ${name} asset is not a JSON array.`);
    cache.set(name, records);
  } catch (error) {
    if (!isNotFound(error)) throw error;
    cache.set(name, structuredClone(defaults[name]));
    await saveCollection(name);
  }
  return cache.get(name);
}

async function saveCollection(name) {
  const previousWrite = writes.get(name) || Promise.resolve();
  const nextWrite = previousWrite.then(() => new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(cache.get(name), null, 2));
    const upload = cloudinary.uploader.upload_stream({
      resource_type: 'raw',
      public_id: collectionIds[name],
      overwrite: true,
      invalidate: true,
      type: 'upload'
    }, (error, result) => {
      if (error) return reject(error);
      if (!result?.secure_url) return reject(new Error(`Cloudinary did not confirm saving ${name}.`));
      resolve();
    });
    upload.end(data);
  }));
  writes.set(name, nextWrite.catch(() => {}));
  await nextWrite;
}

function validateRecord(name, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'A JSON object is required.';
  const requiredFields = {
    messages: ['disciplerId', 'disciplerName', 'title', 'content', 'date'],
    blogs: ['title', 'content', 'author', 'date'],
    disciplers: ['name', 'email', 'phone']
  }[name];
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      return `${field} is required.`;
    }
  }
  if (name === 'messages' && (!Number.isSafeInteger(Number(body.disciplerId)) || Number(body.disciplerId) < 1)) {
    return 'disciplerId must be a positive integer.';
  }
  if (name === 'messages' || name === 'blogs') {
    if (!Number.isFinite(Date.parse(body.date))) return 'date must be a valid date.';
  }
  for (const field of ['imageUrl', 'avatar']) {
    if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
      try {
        if (new URL(body[field]).protocol !== 'https:') return `${field} must be an HTTPS URL.`;
      } catch {
        return `${field} must be a valid HTTPS URL.`;
      }
    }
  }
  return null;
}

app.get('/api/health', (_request, response) => {
  const missing = [];
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');
  if (!process.env.SESSION_SECRET) missing.push('SESSION_SECRET');
  if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
  if (!process.env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');
  response.status(missing.length ? 503 : 200).json({ status: missing.length ? 'configuration-required' : 'ok', missing });
});

app.post('/api/admin/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false
}), (request, response) => {
  const missing = authenticationConfigurationError();
  if (missing) return response.status(503).json({ error: missing });

  const password = request.body?.password;
  if (typeof password !== 'string' || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return response.status(401).json({ error: 'Invalid password.' });
  }

  const expiresAt = String(Date.now() + sessionDurationMs);
  const value = `${expiresAt}.${signSession(expiresAt)}`;
  response.cookie(sessionCookieName, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: sessionDurationMs
  });
  response.status(204).end();
});

app.get('/api/admin/session', (request, response) => {
  if (hasAdminSession(request)) return response.status(204).end();
  response.status(401).json({ error: 'Admin session required.' });
});

app.delete('/api/admin/session', requireAdmin, (request, response) => {
  response.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  response.status(204).end();
});

app.post('/api/cloudinary/signature', requireAdmin, (request, response) => {
  if (!requireCloudinary(response)) return;
  const folder = request.body?.folder;
  if (typeof folder !== 'string' || !allowedFolders.has(folder)) {
    return response.status(400).json({ error: 'Unsupported upload folder.' });
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters = { folder, timestamp };
  response.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    signature: cloudinary.utils.api_sign_request(parameters, process.env.CLOUDINARY_API_SECRET),
    timestamp,
    folder
  });
});

for (const name of Object.keys(collectionIds)) {
  app.get(`/api/${name}`, async (_request, response, next) => {
    if (cloudinaryConfigurationError()) {
      response.set('X-Content-Storage', 'demo-seed');
      return response.json(cache.get(name) || structuredClone(defaults[name]));
    }
    try {
      response.json(await loadCollection(name));
    } catch (error) {
      next(error);
    }
  });

  app.post(`/api/${name}`, requireAdmin, async (request, response, next) => {
    if (!requireCloudinary(response)) return;
    const validationError = validateRecord(name, request.body);
    if (validationError) return response.status(400).json({ error: validationError });
    try {
      const records = await loadCollection(name);
      const id = records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
      const created = { ...request.body, id };
      if (created.date) created.date = new Date(created.date).toISOString();
      if (created.disciplerId) created.disciplerId = Number(created.disciplerId);
      records.push(created);
      await saveCollection(name);
      response.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  app.put(`/api/${name}/:id`, requireAdmin, async (request, response, next) => {
    if (!requireCloudinary(response)) return;
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return response.status(400).json({ error: 'Invalid record id.' });
    try {
      const records = await loadCollection(name);
      const index = records.findIndex(record => record.id === id);
      if (index < 0) return response.status(404).json({ error: 'Record not found.' });
      const updated = { ...records[index], ...request.body, id };
      const validationError = validateRecord(name, updated);
      if (validationError) return response.status(400).json({ error: validationError });
      if (updated.date) updated.date = new Date(updated.date).toISOString();
      if (updated.disciplerId) updated.disciplerId = Number(updated.disciplerId);
      records[index] = updated;
      await saveCollection(name);
      response.json(updated);
    } catch (error) {
      next(error);
    }
  });

  app.delete(`/api/${name}/:id`, requireAdmin, async (request, response, next) => {
    if (!requireCloudinary(response)) return;
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return response.status(400).json({ error: 'Invalid record id.' });
    try {
      const records = await loadCollection(name);
      const remaining = records.filter(record => record.id !== id);
      if (remaining.length === records.length) return response.status(404).json({ error: 'Record not found.' });
      cache.set(name, remaining);
      await saveCollection(name);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });
}

app.use((error, _request, response, _next) => {
  console.error('API request failed', error);
  if (response.headersSent) return;
  response.status(500).json({ error: 'The server could not complete the request.' });
});

app.listen(port, () => {
  console.log(`Family Discipleship API listening on http://127.0.0.1:${port}`);
});
