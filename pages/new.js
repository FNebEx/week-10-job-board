import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from 'react';

function New() {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  if(!session || !session.user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch('/api/job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, title, salary, location })
    });

    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col w-1/2 mx-auto'>
        <h2 className='mt-10 mb-10 text-4xl font-bold'>Post a new job!</h2>
        <div className=' pt-2 mt-2 mr-1'>
          <input 
            type="text" 
            placeholder="Job title"
            required
            // I think a value should be here...
            className="border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="pt-2 mt-2 mr-1">
          <textarea 
            className="border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary"
            required
            placeholder="Job description"
            rows={2} 
            cols={50} 
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div>
          <input 
            className="border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary"
            type="text" 
            required
            placeholder="Salary"
            onChange={(event) => setSalary(event.target.value)}
          />
        </div>
        <div>
          <input 
            className="border p-4 w-full text-lg font-medium bg-transparent outline-none color-primary"
            type="text" 
            required
            placeholder="Location"
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>
        <div className="mt-5">
          <button className='border float-right px-8 py-2 mt-0  font-bold rounded-full'>
            Post job
          </button>
        </div>
      </div>
    </form>
  );
}

export default New;