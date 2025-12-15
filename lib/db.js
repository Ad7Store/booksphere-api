// Simple in-memory database (for demo - use Vercel KV or PostgreSQL in production)
const books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel of the Jazz Age',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    content: 'Chapter 1...',
    createdAt: new Date().toISOString()
  }
];

const users = [
  {
    id: '1',
    email: 'admin@bookstore.com',
    password: '$2b$10$examplehashedpassword',
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
];

export class Database {
  static async getBooks() {
    return books;
  }

  static async getBook(id) {
    return books.find(book => book.id === id);
  }

  static async addBook(book) {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    return newBook;
  }

  static async updateBook(id, updates) {
    const index = books.findIndex(book => book.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...updates };
    return books[index];
  }

  static async deleteBook(id) {
    const index = books.findIndex(book => book.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  }

  static async findUserByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async createUser(user) {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isAdmin: user.email === process.env.ADMIN_EMAIL
    };
    users.push(newUser);
    return newUser;
  }
}