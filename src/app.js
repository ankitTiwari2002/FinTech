const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');
const { swaggerUi, specs, CSS_URL, JS_URLS } = require('./config/swagger');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "*"]
        },
    },
}));
app.use(cors());

// Rate limiting (100 requests per 10 mins per IP)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100,
});
app.use(limiter);

// Body parser
app.use(express.json());

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Swagger Docs
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res) => {
    res.send(swaggerUi.generateHTML(specs, {
        customCssUrl: CSS_URL,
        customJs: JS_URLS,
        explorer: true
    }));
});

// Redirect root to API docs
app.get('/', (req, res) => res.redirect('/api-docs'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
