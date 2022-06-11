import { getJob } from "lib/data";
import prisma from "lib/prisma";
import Link from "next/link";

function Job({ job }) {
  return (
    <div className='flex flex-col w-1/2 mx-auto'>
      <div className='text-center p-4 m-4'>
        <Link href={'/'}>
          <a className='mb-10 text-sm font-bold underline'>back</a>
        </Link>
      </div>
      <div className='text-center p-4 m-4'>
        <h1 className='mb-10 text-4xl font-bold'>{ job.title }</h1>
      </div>
      <div className='mb-4 mt-20'>
        <div className='pl-16 pr-16 -mt-6'>
          <p className='text-base font-normal mt-3'>{ job.description }</p>
          <div className='mt-4'>
            <h4 className='inline'>Posted By</h4>
            <div className='inline'>
              <div className='ml-3 -mt-6 inline'>
                <span>
                  <Link href={`/company/${job.author.id}`}>
                    <a>
                      <span className='text-base font-medium color-primary underline'>{ job.author.name }</span>
                    </a>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Job;

export async function getServerSideProps({ params }) {
  let job = await getJob(params.id, prisma);
  job = JSON.parse(JSON.stringify(job));

  return {
    props: {
      job
    }
  }
}