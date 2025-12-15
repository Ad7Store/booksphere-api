import { Database } from '../../lib/db.js';
import { Auth } from '../../lib/auth.js';

export default async function handler(req, res) {
  // GET - Public access
  if (req.method === 'GET') {
    try {
      const books = await Database.getBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // Verify token for other methods
  const token = req.headers.authorization?.split(' ')[1];
  const user = token ? Auth.verifyToken(token) : null;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // POST - Admin only
  if (req.method === 'POST') {
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const book = req.body;
      const newBook = await Database.addBook(book);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // PUT - Admin only
  if (req.method === 'PUT') {
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const { id, ...updates } = req.body;
      const updatedBook = await Database.updateBook(id, updates);
      if (!updatedBook) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(200).json(updatedBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // DELETE - Admin only
  if (req.method === 'DELETE') {
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const { id } = req.query;
      const success = await Database.deleteBook(id);
      if (!success) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}