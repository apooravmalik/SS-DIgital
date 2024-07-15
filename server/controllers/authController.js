import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://diwopcqhbzvlfzohokts.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)

export const signup = async (req, res) => {
    const { email, password } = req.body;
    console.log('Signup attempt for:', email);

    try {
        if (!supabase.auth) {
            throw new Error('Supabase auth is not available');
        }

        // Signup the user
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signupError) {
            console.error('Signup error:', signupError);
            return res.status(400).json({ error: signupError.message });
        }

        const user = signupData.user;
        if (user) {
            // Insert profile data
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: user.id, email, role: 'user' }]);

            if (profileError) {
                console.error('Profile insertion error:', profileError);
                return res.status(400).json({ error: profileError.message });
            }

            // Sign in the user to get a token
            const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signinError) {
                console.error('Auto login error after signup:', signinError);
                return res.status(200).json({ message: 'Signup successful, but auto-login failed. Please log in manually.' });
            }

            const token = signinData.session.access_token;

            return res.status(200).json({ 
                message: 'Signup successful!', 
                token,
                role: 'user'
            });
        } else {
            console.error('User signup failed');
            return res.status(400).json({ error: 'User signup failed' });
        }
    } catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log('Login error:', error.message);  // Add this line for debugging
            return res.status(400).json({ error: error.message });
        }

        const user = data.user;
        const token = data.session.access_token; // Extract the token

        if (user) {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Profile retrieval error:', profileError);
                return res.status(400).json({ error: profileError.message });
            }

            const role = profileData.role;
            return res.status(200).json({ 
                message: 'Login successful!', 
                role,
                token // Include the token in the response
            });
        } else {
            console.error('User login failed');
            return res.status(400).json({ error: 'User login failed' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};