const authResolver = require('./auth');
const tutorResolver = require('./tutor');
const studentResolver = require('./student');

const rootResolver = {
  ...authResolver,
  ...tutorResolver,
  ...studentResolver,
};

module.exports = rootResolver;