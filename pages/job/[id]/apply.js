import { useState } from 'react';
import { getJob } from "lib/data";
import prisma from "lib/prisma";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Apply({ job }) {
  const [coverletter, setCoverletter] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const handleSumbit = async (event) => {
    event.preventDefault();
    await fetch('/api/application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverletter,
        job: job.id
      })
    });

    router.push('/dashboard');
  }

  if(!session) return <h1>Not logged in</h1>;

  return (
    <form onSubmit={handleSumbit}>
      <div className='flex flex-col w-1/2 mx-auto'>
        <div className='mt-10'>
          <div className='text-center p-4 m-4'>
            <Link href={`/job/${job.id}`}>
              <a className='mb-10 text-sm font-bold underline'>back</a>
            </Link>
          </div>
          <div>
            <h2>Apply to the job { job.title }</h2>
          </div>

          <div className='text-center p-4 m-4'>
            <div className='mb-10 text-4xl font-bold'>
              <p className='text-base font-normal mt-3'>{ job.description }</p>
              <div className='mt-4'>
                <h4 className='inline'>Posted by</h4>
                <div className='inline'>
                  <div className='ml-3 -mt-6 inline'> 
                    <span>
                      <Link href={`/company/${job.author.id}`}>
                        <span className='text-base font-medium color-primary underline'>
                          <a>{ job.author.name }</a>
                        </span>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='pt-2 mt-2 mr-1'>
          <textarea 
            onChange={(event) => setCoverletter(event.target.value)}
            className='border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary'
            placeholder='Cover letter'
            required
            rows={6} 
            cols={50}
          />
        </div>
        <div className='mt-5'>
          <button className='border float-right px-8 py-2 mt-0  font-bold rounded-full'>Apply to this job</button>
        </div>
      </div>
    </form>
  );
}

export default Apply;

export async function getServerSideProps({ params }) {
  let job = await getJob(params.id, prisma);
  job = JSON.parse(JSON.stringify(job))
  
  return {
    props: {
      job
    }
  }
}