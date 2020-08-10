const _ = require('lodash');
const { hideProtectedFields } = require('../helpers/jobHelpers');

async function handler(req, res) {
  if (!req.session.loggedin) {
    res.redirect('/');
    return;
  }
  const { queueName, queueHost, id } = req.params;
  const { json } = req.query;
  const basePath = req.baseUrl;

  const { Queues } = req.app.locals;
  const queue = await Queues.get(queueName, queueHost);
  if (!queue) return res.status(404).render('dashboard/templates/queueNotFound', { basePath, queueName, queueHost });

  let job = await queue.getJob(id);
  if (!job) return res.status(404).render('dashboard/templates/jobNotFound', { basePath, id, queueName, queueHost });

  if (json === 'true') {
    // Omit these private and non-stringifyable properties to avoid circular
    // references parsing errors.
    return res.json(_.omit(job, 'domain', 'queue', '_events', '_eventsCount'));
  }

  const jobState = await job.getState();
  job.retryButtonText = jobState === 'failed' ? 'Retry' : 'Clone';

  let logs = await queue.getJobLogs(job.id);
  job.logs = (logs.logs || "No Logs");

  job = hideProtectedFields(job);

  return res.render('dashboard/templates/jobDetails', {
    basePath,
    queueName,
    queueHost,
    jobState,
    job
  });
}

module.exports = handler;
