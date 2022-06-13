import Job from "./Job";

function Jobs({ jobs, isDashboard }) {
  if(!jobs) return null;
  
  return (
    <>
      {jobs.map((job) => {
        return <Job key={job.id} job={job} isDashboard={isDashboard} />
      })}
    </>
  );
}

export default Jobs;