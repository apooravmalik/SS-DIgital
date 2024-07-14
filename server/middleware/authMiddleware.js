// middleware/authMiddleware.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://diwopcqhbzvlfzohokts.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpd29wY3FoYnp2bGZ6b2hva3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NjE1NDIsImV4cCI6MjAzNTMzNzU0Mn0.7cbXAwh3YG6hgA6CpNREnIquC5dD8vkQGLsLtgeJ54U';

export const supabase = createClient(supabaseUrl, supabaseKey);



export const authenticateUser = async (req, res, next) => {
    // Allow CORS preflight requests to pass through
    if (req.method === 'OPTIONS') {
        return next();
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.body && req.body.token) {
        token = req.body.token;
    }

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error('Supabase auth error:', error.message);
            req.user = null;
            return next();
        }

        if (!user) {
            console.warn('No user found for the provided token');
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Error in auth middleware:', err.message);
        req.user = null;
        next();
    }
};