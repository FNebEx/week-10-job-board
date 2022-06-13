import Job from "components/Job";
import Jobs from "components/Jobs";
import { getApplications, getJobsPosted, getUser } from "lib/data";
import prisma from "lib/prisma";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";

function Dashboard({ jobs, user, applications }) {
  const { data: session, status } = useSession();

  return (
    <div className="mt-10">
      <div className="text-center p-4 m-4">
        <Link href={'/'}>
          <a>back</a>
        </Link>
        <h2 className="mb-10 text-4xl font-bold">Dashboard</h2>
        {user.company && (
          <p className="mt-10 mb-10 text-2xl font-normal">{user.company ? 'all the jobs you posted' : 'your applications'}</p>
        )}
      </div>
      { user.company ? (
        <div>
          {jobs.map(job => {
            return (
              <>
                <Job key={job.id} job={job} isDashboard={true} />

                <div className="mb-4 mt-20">
                  <div className="pl-16 pr-16 -mt-6">
                    {job.applications.length === 0 ? (
                      <p className="mb-10 text-2xl font-normal">No applications so far 😢</p>
                    ) : (
                      <p className="mb-10 text-2xl font-normal">{job.applications.length} applications</p>
                    )}
                    {job.applications?.map(application => {
                      <>
                        <h2 className="text-base font-normal mt-3 mr-3">
                          <span className="text-base font-normal mt-3 mr-3">{application.author.name}</span>
                          {application.author.email}
                        </h2>
                        <p className="text-lg font-normal mt-2 mb-3">{application.coverletter}</p>
                      </>
                    })}
                  </div>
                </div>
              </>
            )
          })}
        </div>
      ) : (
        <>
          {applications.map(app => {
            return (
              <div key={app.id} className="mb-4 mt-20 flex justify-center">
                <div className="pl-16 pr-16 -mt-6 w-1/2">
                  <Link href={`/job/${app.job.id}`}>
                    <a className="text-xl font-bold underline">{app.job.title}</a>
                  </Link>
                  <h2 className="text-base font-normal mt-3">{app.coverletter}</h2>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let user = await getUser(session.user.id, prisma);
  let jobs = [];
  let applications = [];

  user = JSON.parse(JSON.stringify(user));

  if(user.company) {
    jobs = await getJobsPosted(user.id, prisma);
    jobs = JSON.parse(JSON.stringify(jobs));
  } else {
    applications = await getApplications(user.id, prisma);
    applications = JSON.parse(JSON.stringify(applications));
  }
  

  return {
    props: {
      jobs, user, applications
    }
  }
}