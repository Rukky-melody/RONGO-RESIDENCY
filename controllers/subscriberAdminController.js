const Subscriber = require('../models/Subscriber');

/**
 * GET /api/admin/subscribers
 * Protected — returns all subscribers sorted by newest first.
 */
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ signupDate: -1 });
        res.json(subscribers);
    } catch (err) {
        console.error('getSubscribers error:', err.message);
        res.status(500).json({ error: 'Failed to fetch subscribers.' });
    }
};

/**
 * GET /api/admin/subscribers/export
 * Protected — streams a CSV file of all subscribers.
 */
const exportSubscribersCSV = async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ signupDate: -1 });

        const csvRows = [
            'Full Name,Email,Signup Date',
            ...subscribers.map(s => {
                const date = s.signupDate
                    ? new Date(s.signupDate).toLocaleDateString('en-GB')
                    : 'N/A';
                // Escape any commas or quotes in name/email
                const name  = `"${(s.fullname || '').replace(/"/g, '""')}"`;
                const email = `"${(s.email   || '').replace(/"/g, '""')}"`;
                return `${name},${email},"${date}"`;
            })
        ];

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="rongo_subscribers.csv"');
        res.send(csvRows.join('\n'));
    } catch (err) {
        console.error('exportSubscribersCSV error:', err.message);
        res.status(500).json({ error: 'Failed to export subscribers.' });
    }
};

/**
 * DELETE /api/admin/subscribers/:id
 * Protected — deletes a single subscriber by ID.
 */
const deleteSubscriber = async (req, res) => {
    try {
        const deleted = await Subscriber.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Subscriber not found.' });
        }
        res.json({ success: true, message: 'Subscriber deleted successfully.' });
    } catch (err) {
        console.error('deleteSubscriber error:', err.message);
        res.status(500).json({ error: 'Failed to delete subscriber.' });
    }
};

/**
 * POST /api/admin/subscribers/bulk-delete
 * Protected — deletes multiple subscribers given an array of IDs.
 */
const bulkDeleteSubscribers = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Please provide an array of subscriber IDs.' });
        }
        
        await Subscriber.deleteMany({ _id: { $in: ids } });
        res.json({ success: true, message: `${ids.length} subscribers deleted successfully.` });
    } catch (err) {
        console.error('bulkDeleteSubscribers error:', err.message);
        res.status(500).json({ error: 'Failed to bulk delete subscribers.' });
    }
};

module.exports = { getSubscribers, exportSubscribersCSV, deleteSubscriber, bulkDeleteSubscribers };
