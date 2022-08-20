const mongoose = require('mongoose');

const assignment_schema = mongoose.Schema(
    {
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
            required: true
        },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }],
        published_at: {
            type: Date,
            default: new Date()
        },
        deadline_date: {
            type: Date,
            required: true
        }
    }
);


module.exports = mongoose.model('Assignment', assignment_schema);
