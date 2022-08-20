const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type AuthData {
  userId: ID
  username: String
  token: String!
}
type Message {
  message:String!
}
type Get_Assignments{
  id:String
  tutor:String
  description:String
  students:[String]
  published_at:String
  deadline_date:String
  status:String
}
type Get_Submissions{
  id:String
  student:String
  assignment:String
  remark:String
  status:String
}
enum PublishedAt{
  SCHEDULED
  ONGOING
}
enum Status{
  ALL
  PENDING
  OVERDUE
  SUBMITTED
}
type RootQuery {
  tutor_login(username: String!, password: String!): AuthData!
  student_login(username: String!, password: String!): AuthData!
  get_assignments(publishedAt:PublishedAt): [Get_Assignments]
  get_submissions(assignment_id:String!): [Get_Submissions]
  delete_assignment(assignment_id:String!):Message

  get_assigned_assignment(publishedAt:PublishedAt, status:Status):[Get_Assignments]
  get_submission(assignment_id:String!):Get_Submissions

  
}                             
type RootMutation {
create_assignment(description:String!, students:[String!], published_at:String,deadline_date:String!):Message
update_assignment(assignment_id:String!,description:String, students:[String!], published_at:String,deadline_date:String):Message

add_submission(assignment_id:String!, remark:String!):Message
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
