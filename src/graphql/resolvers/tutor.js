const user_model = require('../../model/user.model');
const assignment_model = require('../../model/assignment.model');
const submission_model = require('../../model/submission.model');


module.exports = {

    create_assignment: async ({ description, students, published_at, deadline_date }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            const deadline_time = new Date(deadline_date)
            const current_date = new Date()
            const user_data = await user_model.findById(req.userId)
            let published_time = current_date
            if (user_data.user != "TUTOR") throw new Error('Assignments can only created by Tutor')
            if (deadline_time < current_date) throw new Error("Please provide deadline date greater than current date and time")
            if (published_at) {
                published_time = new Date(published_at)
                if (published_time < current_date) throw new Error("Please provide published date greater than current date and time")

            }
            if (deadline_time <= published_time) throw new Error("Deadline date should be greater than published date")

            const assignment_data = await assignment_model.create({ tutor: req.userId, description, students, published_at: published_time, deadline_date: deadline_time })
            for (let i = 0; i < students.length; i++)
                await submission_model.create({ student: students[i], assignment: assignment_data._id })
            const message = "Assignment Created Successfully"
            return { message }

        } catch (err) {
            throw err
        }


    },
    //       Assigment Feed

    get_assignments: async ({ publishedAt }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            const current_date = new Date()

            let filter = { tutor: req.userId }
            if (publishedAt === "SCHEDULED") filter.published_at = { $gt: current_date }
            if (publishedAt === "ONGOING") filter.published_at = { $lte: current_date }
            console.log(filter);
            let result = await assignment_model.find(filter)
            result = result.map((res) => {
                let status = "ONGOING"
                if (res.published_at > current_date) status = "SCHEDULED"
                return {
                    id: res.id,
                    tutor: res.tutor,
                    description: res.description,
                    students: res.students,
                    published_at: res.published_at.toLocaleString(),
                    deadline_date: res.deadline_date.toLocaleString(),
                    status
                }

            })
            return result

        } catch (err) {
            throw err
        }


    },
    get_submissions: async ({ assignment_id }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            const result = await submission_model.find({ assignment: assignment_id, status: "SUBMITTED" })
            return result
        } catch (err) {
            throw err
        }


    },
    update_assignment: async ({ assignment_id, description, published_at, deadline_date }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            let query = {}
            const assignment_data = await assignment_model.findById(assignment_id)
            const current_date = new Date()
            let published_time = assignment_data

            if (description) query.description = description
            if (published_at) {
                published_time = new Date(published_at)
                if (published_time < current_date) throw new Error("Please provide published date greater than current date and time")
                query.published_at = published_time


            }
            if (deadline_date) {
                const deadline_time = new Date(deadline_date)
                if (deadline_time < current_date) throw new Error("Please provide deadline date greater than current date and time")
                if (deadline_time <= published_time) throw new Error("Deadline date should be greater than published date")
                query.deadline_date = deadline_time
            }
            await assignment_model.findOneAndUpdate({ _id: assignment_id, tutor: req.userId }, query)
            const message = "Assignment Updated Successfully"
            return { message }

        } catch (err) {
            throw err
        }


    },
    delete_assignment: async ({ assignment_id }, req) => {
        try {
            if (!req.isAuth) throw new Error('Unauthenticated!');
            await assignment_model.findByIdAndDelete(assignment_id)
            await submission_model.deleteMany({ assignment: assignment_id })
            const message = "Assignment Deleted Successfully"
            return { message }

        } catch (err) {
            throw err
        }


    }













}