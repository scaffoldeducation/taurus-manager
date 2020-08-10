const jobConfig = require('../../config/job');

module.exports = {
  hideProtectedFields: (job) => {
    const protectedFields = jobConfig.getProtectedFields();

    if (protectedFields) {
      protectedFields.forEach((field) => {
        if (job.data[field]) {
          job.data[field] = "{{PROTECTED CONTENT}}";
        }

        let deep = field.split('.');

        if (deep.length > 1) {
          job.data[deep[0]][deep[1]] = "{{PROTECTED CONTENT}}";
        }
      });
    }

    return job;
  }
};