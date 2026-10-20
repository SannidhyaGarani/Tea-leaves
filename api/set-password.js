import { adminAuth } from './_lib/firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Authentication token is missing.' });
    }

    const idToken = authHeader.split('Bearer ')[1].trim();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { password } = req.body || {};
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
    }

    // Set password through Firebase Authentication
    await adminAuth.updateUser(uid, { password });

    return res.status(200).json({
      success: true,
      message: 'Password successfully set for faster login next time.',
    });
  } catch (error) {
    console.error('[SetPassword Error]:', error.message);
    return res.status(500).json({
      error: 'Failed to set password: ' + (error.message || 'Please try again later.'),
    });
  }
}
