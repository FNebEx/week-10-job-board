import Job from "./Job";

function Jobs({ jobs }) {
  if(!jobs) return null;
  
  return (
    <>
      {jobs.map((job) => {
        return <Job key={job.id} job={job}/>
      })}
    </>
  );
}

export default Jobs;