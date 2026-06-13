// Controller for URL shortening, listing, deletion, analytics, and redirection

const validator = require('validator');
const prisma = require('../config/prisma');
const { generateUniqueShortCode } = require('../utils/generateShortCode');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/**
 * POST /api/urls
 * Creates a new shortened URL associated with the logged-in user.
 */
async function createUrl(req, res) {
  try {
    const { originalUrl } = req.body;
    const userId = req.user.id;

    // --- Validation ---
    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({ message: 'Original URL is required.' });
    }

    const trimmedUrl = originalUrl.trim();

    if (!validator.isURL(trimmedUrl, { require_protocol: true })) {
      return res.status(400).json({
        message: 'Please provide a valid URL including http:// or https://',
      });
    }

    // --- Generate unique short code ---
    const shortCode = await generateUniqueShortCode();

    // --- Save to database ---
    const url = await prisma.url.create({
      data: {
        originalUrl: trimmedUrl,
        shortCode,
        userId,
      },
    });

    return res.status(201).json({
      message: 'Short URL created successfully.',
      url: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${BASE_URL}/${url.shortCode}`,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    console.error('Create URL error:', error);
    return res.status(500).json({ message: 'Something went wrong while creating the short URL.' });
  }
}

/**
 * GET /api/urls
 * Returns all URLs created by the logged-in user, most recent first.
 */
async function getUrls(req, res) {
  try {
    const userId = req.user.id;

    const urls = await prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = urls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${BASE_URL}/${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
    }));

    return res.status(200).json({ urls: formatted });
  } catch (error) {
    console.error('Get URLs error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching your URLs.' });
  }
}

/**
 * DELETE /api/urls/:id
 * Deletes a URL owned by the logged-in user. Cascades to delete visits.
 */
async function deleteUrl(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const url = await prisma.url.findUnique({ where: { id } });

    if (!url) {
      return res.status(404).json({ message: 'URL not found.' });
    }

    // --- Ensure the URL belongs to the logged-in user ---
    if (url.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this URL.' });
    }

    await prisma.url.delete({ where: { id } });

    return res.status(200).json({ message: 'URL deleted successfully.' });
  } catch (error) {
    console.error('Delete URL error:', error);
    return res.status(500).json({ message: 'Something went wrong while deleting the URL.' });
  }
}

/**
 * GET /api/urls/:id/analytics
 * Returns summary and recent visit data for a URL owned by the logged-in user.
 */
async function getAnalytics(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const url = await prisma.url.findUnique({
      where: { id },
      include: {
        visits: {
          orderBy: { visitedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!url) {
      return res.status(404).json({ message: 'URL not found.' });
    }

    if (url.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view this analytics.' });
    }

    const lastVisited = url.visits.length > 0 ? url.visits[0].visitedAt : null;

    return res.status(200).json({
      summary: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortUrl: `${BASE_URL}/${url.shortCode}`,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
        lastVisitedAt: lastVisited,
      },
      recentVisits: url.visits.map((v) => ({
        id: v.id,
        visitedAt: v.visitedAt,
      })),
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({ message: 'Something went wrong while fetching analytics.' });
  }
}

/**
 * GET /:shortCode
 * Public redirect route. Increments click count, logs a visit, and redirects.
 */
async function redirectToOriginal(req, res) {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({ where: { shortCode } });

    if (!url) {
      return res.status(404).send('Short URL not found.');
    }

    // --- Update click count and create visit record ---
    await prisma.$transaction([
      prisma.url.update({
        where: { id: url.id },
        data: { clickCount: { increment: 1 } },
      }),
      prisma.visit.create({
        data: { urlId: url.id },
      }),
    ]);

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).send('Something went wrong while redirecting.');
  }
}

module.exports = { createUrl, getUrls, deleteUrl, getAnalytics, redirectToOriginal };
