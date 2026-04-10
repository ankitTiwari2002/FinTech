const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, user identity missing',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }

        if (typeof next !== 'function') {
            console.error('Role Middleware Error: next is not a function');
            return res.status(500).json({ success: false, error: 'Internal Server Error: Middleware chain broken' });
        }

        next();
    };
};

module.exports = { authorize };
