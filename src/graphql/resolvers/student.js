const user_model = require('../../model/user.model');
const assignment_model = require('../../model/assignment.model');
const submission_model = require('../../model/submission.model');

module.exports = {

    add_submission: async ({ assignment_id, remark }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            const submission_data = await submission_model.findOne({ student: req.userId, assignment: assignment_id })
            if (!submission_data) throw new Error("You don't have any Assignment to Submit");
            if (submission_data.status === "SUBMITTED") throw new Error('You have already Submiited the assignment');
            await submission_model.findOneAndUpdate({ student: req.userId, assignment: assignment_id }, { remark, status: "SUBMITTED" })
            const message = "Submission added Successfully"
            return { message }
        } catch (err) {
            throw err
        }


    },
    //       Assigment Feed

    get_assigned_assignment: async ({ publishedAt, status }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            const current_date = new Date()

            let filter1 = { student: req.userId }
            if (status === "PENDING" || status === "SUBMITTED") filter1.status = status

            let result = await submission_model.find(filter1).populate("assignment")

            result = result.filter(r => {
                let filterApplicable = false
                let filterResults = []

                if (publishedAt === "SCHEDULED") {
                    filterApplicable = true
                    filterResults.push(r.assignment.published_at > current_date)
                }
                if (publishedAt === "ONGOING") {
                    filterApplicable = true
                    filterResults.push(r.assignment.published_at <= current_date)
                }
                if (status === "OVERDUE") {
                    filterApplicable = true
                    filterResults.push(r.assignment.deadline_date < current_date)
                }

                if (filterApplicable) {

                    return (filterResults.filter(e => e === false).length === 0)
                } else {
                    return true
                }
            }).map((res) => {
                let status = "ONGOING"
                if (res.assignment.published_at > current_date) status = "SCHEDULED"
                return {
                    id: res.assignment.id,
                    tutor: res.assignment.tutor,
                    description: res.assignment.description,
                    students: res.assignment.students,
                    published_at: res.assignment.published_at.toLocaleString(),
                    deadline_date: res.assignment.deadline_date.toLocaleString(),
                    status
                }

            })
            return result

        } catch (err) {
            throw err
        }


    },
    get_submission: async ({ assignment_id }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            const data = await submission_model.findOne({ assignment: assignment_id, student: req.userId, status: "SUBMITTED" })
            return data
        } catch (err) {
            throw err
        }


    },














}