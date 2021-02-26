const Queue = require('bee-queue');

const options = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const createJobQueue = (nameQueue, query, user, time) => {
  const jobQueue = new Queue(nameQueue, options);

  jobQueue.process((job, done) => {
    let cooked = 0;

    setTimeout(() => console.log(`⏱️  Prepare data queue`), 1000);
    setTimeout(() => {
      console.log(`⏳ Preparing : Queue name ${nameQueue} ${job.id}`);
      job.reportProgress(10);
    }, 1500);

    let timer = setInterval(() => {
      if (cooked < job.id) {
        cooked++;
        console.log(`⌛ Progress : Queue name ${nameQueue} ${job.id}`);
        job.reportProgress(((cooked / job.id) * 90) + 10);
      } else {
        clearInterval(timer);
        console.log(`🧾 Success : Queue name ${nameQueue} ${job.id} ready sending to user : ${user.fullname}`);
        job.reportProgress(100);
        done();

        // notify job in here
      }
    }, time * 60 * 1000);
  });
}

module.exports = {
  createJobQueue
}