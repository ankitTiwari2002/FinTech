const Record = require('../models/Record');

// @desc    Get all records (with pagination and filtering)
// @route   GET /api/records
// @access  Private/Analyst, Admin
exports.getRecords = async (req, res, next) => {
    try {
        const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

        let query = {};

        if (type) query.type = type;
        if (category) query.category = category;
        
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.date = { $lte: new Date(endDate) };
        }

        if (search) {
            query.notes = { $regex: search, $options: 'i' };
        }

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const startIndex = (parsedPage - 1) * parsedLimit;

        const total = await Record.countDocuments(query);

        const records = await Record.find(query)
            .populate('user_id', 'name email')
            .sort({ date: -1 })
            .skip(startIndex)
            .limit(parsedLimit);

        res.status(200).json({
            success: true,
            count: records.length,
            pagination: {
                page: parsedPage,
                limit: parsedLimit,
                total,
                totalPages: Math.ceil(total / parsedLimit)
            },
            data: records,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Private/Analyst, Admin
exports.getRecord = async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id).populate('user_id', 'name email');

        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }

        res.status(200).json({ success: true, data: record });
    } catch (error) {
        // Handle malformed/invalid ObjectId — return a clean 404 instead of a 500
        if (error.name === 'CastError') {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        next(error);
    }
};

// @desc    Create new record
// @route   POST /api/records
// @access  Private/Admin
exports.createRecord = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user_id = req.user.id;

        const record = await Record.create(req.body);

        res.status(201).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private/Admin
exports.updateRecord = async (req, res, next) => {
    try {
        let record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }

        record = await Record.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: record });
    } catch (error) {
        // Handle malformed/invalid ObjectId — return a clean 404 instead of a 500
        if (error.name === 'CastError') {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        next(error);
    }
};

// @desc    Soft Delete record
// @route   DELETE /api/records/:id
// @access  Private/Admin
exports.deleteRecord = async (req, res, next) => {
    try {
        let record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }

        // Soft delete
        record.isDeleted = true;
        await record.save();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        // Handle malformed/invalid ObjectId — return a clean 404 instead of a 500
        if (error.name === 'CastError') {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        next(error);
    }
};
