import { Database } from '../../lib/db.js';
import { Auth } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    const existingUser = await Database.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await Auth.hashPassword(password);
    const user = await Database.createUser({
      email,
      password: hashedPassword
    });

    const token = Auth.generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}