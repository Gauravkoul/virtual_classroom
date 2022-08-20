const mongoose = require('mongoose');

const submission_schema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
            required: true
        },
        remark: {
            type: String
        },
        status: {
            type: String,
            enum: ['SUBMITTED', 'PENDING'],
            default: "PENDING"
        }
    }
);


module.exports = mongoose.model('Submission', submission_schema);
