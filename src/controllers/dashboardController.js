const Record = require('../models/Record');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private/Viewer, Analyst, Admin
exports.getSummary = async (req, res, next) => {
    try {
        // Aggregation to get total income, total expenses and net balance
        const totals = await Record.aggregate([
            { $match: { isDeleted: { $ne: true } } },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
                    },
                    totalExpense: {
                        $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
                    }
                }
            }
        ]);

        const summary = totals.length > 0 ? totals[0] : { totalIncome: 0, totalExpense: 0 };
        const netBalance = summary.totalIncome - summary.totalExpense;

        // Category-wise totals for 'expense'
        const categoryWiseExpenses = await Record.aggregate([
            { $match: { isDeleted: { $ne: true }, type: 'expense' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // Category-wise totals for 'income'
        const categoryWiseIncome = await Record.aggregate([
            { $match: { isDeleted: { $ne: true }, type: 'income' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // Recent activity (last 5 records)
        const recentActivity = await Record.find({ isDeleted: { $ne: true } })
            .sort({ date: -1, createdAt: -1 })
            .limit(5)
            .select('-isDeleted');

        res.status(200).json({
            success: true,
            data: {
                totalIncome: summary.totalIncome,
                totalExpense: summary.totalExpense,
                netBalance,
                categoryWiseExpenses,
                categoryWiseIncome,
                recentActivity
            }
        });
    } catch (error) {
        console.error('Dashboard Controller Error:', error.message);
        if (typeof next !== 'function') {
            console.error('CRITICAL: next is not a function in dashboardController');
            return res.status(500).json({ success: false, error: 'Internal Server Error: middleware chain broken' });
        }
        next(error);
    }
};
