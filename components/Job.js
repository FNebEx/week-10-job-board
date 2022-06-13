import Link from "next/link";
import { useRouter } from "next/router";

function Job({ job, isDashboard  }) {
  const router = useRouter();
  const handleUnublished = async (event) => {
    event.preventDefault();
    await fetch('/api/job', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: job.id, 
        task: 'unpublish'
      })
    });
    router.reload(window.location.pathname);
  }
  
  const handlePublished = async (event) => {
    event.preventDefault();
    await fetch('/api/job', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: job.id, 
        task: 'publish'
      })
    });
    router.reload(window.location.pathname);
  }
  

  return (
    <div className='mb-4 mt-20 pl-16 pr-16'>
      <Link href={`/job/${job.id}`}>
        <a className='text-xl font-bold underline'>{ job.title }</a>
      </Link>
      <h2 className='text-base font-normal mt-3'>{ job.description }</h2>
      <div className='mt-4'>
        {isDashboard && job.published && (
          <button onClick={handleUnublished} className="bg-black text-white uppercase text-sm p-2 mr-5">✅ Published</button>
        )}
        {isDashboard && !job.published && (
          <button onClick={handlePublished} className="bg-black text-white uppercase text-sm p-2 mr-5 mb-5">❌ Unpublished</button>
        )}
        <h4 className='inline'>Posted by <span className='text-base font-medium color-primary underline'>{ job.author.name }</span></h4>
      </div>
    </div>
  );
}

export default Job;