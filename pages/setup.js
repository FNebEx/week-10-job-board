import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Setup() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [company, setCompany] = useState(false);
  const loading = status === 'loading';

  if(loading) return <p>Loading...</p>;
  
  if(!session || !session.user) {
    router.push('/');
    return null;
  }
  
  /**
   * Maybe display something that allows the user to 
   * click to go the Home page...
   */
  if(!loading && session && session.user.name) {
    router.push('/');
  }
  
  return (
    <form
      className='mt-10 ml-20'
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch('/api/setup', {
          body: JSON.stringify({
            name,
            company,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        session.user.name = name;
        session.user.company = company;
        router.push('/');
      }}
    >
      <div className='flex-1 mb-5'>
        <div className='flex-1 mb-5'>Add your name</div>
        <input
          type='text'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border p-1 text-black'
        />
      </div>

      <div className='flex-1 mb-5'>
        <div className='flex-1 mb-5'>
          Check this box if you're a company and you want to post jobs
        </div>
        <input
          type='checkbox'
          name='company'
          checked={company}
          onChange={(e) => setCompany(!company)}
          className='border p-1'
        />
        {/* {session && (
        <a 
          href="/api/auth/signout"
          className="border px-8 py-2 mt-5 ml-16 font-bold rounded-full bg-black text-white border-black "
        >logout</a>
      )} */}
      </div>

      <button className='border px-8 py-2 mt-0 mr-8 font-bold rounded-full color-accent-contrast bg-color-accent hover:bg-color-accent-hover'>
        Save
      </button>
    </form>
  )
}