const mongoose = require('mongoose');
const Job = require('../models/Job');

// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { status, search, sort = '-createdAt', priority } = req.query;
    const userId = req.user._id;

    // Build filter
    const filter = { user: userId };
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Run jobs query and stats aggregation in parallel
    const [jobs, statsAgg] = await Promise.all([
      Job.find(filter).sort(sort).lean(),
      Job.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const stats = { wishlist: 0, applied: 0, interview: 0, offer: 0, rejected: 0 };
    statsAgg.forEach(({ _id, count }) => {
      if (_id in stats) stats[_id] = count;
    });

    // Monthly activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyAgg = await Job.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ jobs, stats, total: jobs.length, monthly: monthlyAgg });
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs.' });
  }
};

// GET /api/jobs/:id
const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job.' });
  }
};

// POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { company, position, location, status, salary, url, notes, appliedDate, priority, tags } =
      req.body;

    if (!company || !position) {
      return res.status(400).json({ message: 'Company and position are required.' });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      position,
      location: location || 'Remote',
      status: status || 'applied',
      salary: salary || '',
      url: url || '',
      notes: notes || '',
      appliedDate: appliedDate || new Date(),
      priority: priority || 'medium',
      tags: tags || [],
    });

    res.status(201).json(job);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Failed to create job.' });
  }
};

// PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    // Only editable fields may be changed; ownership and MongoDB operators
    // must never come from client input.
    const fields = ['company', 'position', 'location', 'status', 'salary', 'url',
      'notes', 'appliedDate', 'priority', 'tags'];
    const updates = {};
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedJob) return res.status(404).json({ message: 'Job not found.' });

    res.json(updatedJob);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Failed to update job.' });
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json({ message: 'Job deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job.' });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
