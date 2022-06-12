import Jobs from "components/Jobs";
import { getJobs, getUser } from "lib/data";
import prisma from "lib/prisma";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Index({ jobs, user }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  if(session && !session.user.name) {
    console.log(session);
    router.push('/setup');
  }

  return (
    <div className="mt-10">
      {!session && (
        <a 
          href="/api/auth/signin"
          className="border px-8 py-2 mt-5 ml-16 font-bold rounded-full bg-black text-white border-black "
        >login</a>
      )}
      {session && (
        <a 
          href="/api/auth/signout"
          className="border px-8 py-2 mt-5 ml-16 font-bold rounded-full bg-black text-white border-black "
        >logout</a>
      )}
      <div className="text-center p-4 m-4">
        <h2 className="mb-10 text-4xl font-bold">Find a Job you Hippie!</h2>
        {session && (
          <>
            <p className='mb-10 text-2xl font-normal'>
              Welcome, { user.name }
              {user.company && (
                <span className='bg-black text-white uppercase text-sm p-2'>Company</span>
              )}
            </p>
            {user.company ? (
              <>
                <button className="border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black">New Job</button>
                <button className="ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black">See All Jobs</button>
              </>
            ) : (
              <>
                <button className="ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black">See All Jobs</button>
              </>
            )}
          </>
        )
      }
      </div>
      <Jobs jobs={jobs} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let jobs = await getJobs(prisma);
  jobs = JSON.parse(JSON.stringify(jobs));
  
  if(!session) return { props: { jobs } };
  
  let user = await getUser(session.user.id, prisma);
  user = JSON.parse(JSON.stringify(user));


  return {
    props: {
      jobs,
      user
    }
  }
}