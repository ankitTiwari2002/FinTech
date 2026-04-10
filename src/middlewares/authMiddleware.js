const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.toLowerCase().startsWith('bearer')
    ) {
        try {
            // Robust token extraction: handle both 'Bearer <token>' and 'Bearer<token>'
            const parts = req.headers.authorization.split(' ');
            token = parts.length === 2 ? parts[1] : req.headers.authorization.slice(7);

            if (!token) {
                return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id);
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
            }
            if(!req.user.isActive) {
                 return res.status(401).json({ success: false, error: 'Not authorized, user is inactive' });
            }

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
