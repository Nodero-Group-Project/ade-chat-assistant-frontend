import { useNavigate } from 'react-router-dom';

export default function Home() {

   const navigate = useNavigate();

   return (
            <main className='min-h-screen flex items-center justify-center bg-linear-to-br from-[#202830] to-[#354451] px-6 py-12'>
                <div className='rounded-2xl p-10 w-full max-w-md border border-white/20 text-center bg-white shadow-2xl'>
                    <img className='mx-auto mb-5 w-36 object-contain' src="/logo-nobg.png" alt='Te Kete Aronui Logo'/>
                    <h1 className="text-3xl font-bold tracking-tight text-[#282f37]">Welcome to Te Kete Aronui</h1>
                     <p className="mt-3 text-sm leading-6 text-gray-500">
                        Explore Aotearoa New Zealand's data with natural language.
                     </p>

                    <div className='flex flex-col gap-3 mt-8'>
                        <button className='w-full rounded-lg cursor-pointer transition-colors delay-150 duration-200 ease-in-out bg-[#1dd2e3] px-6 py-3 font-semibold text-[#282f37] hover:opacity-80' onClick={() => navigate('/chat')}>User</button>
                        <button className='rounded-md cursor-pointer transition delay-150 duration-300 ease-in-out border border-black px-5 py-2 font-semibold hover:bg-black/30'onClick={() => navigate('/admin/datasets')}>Admin</button>
                    </div>
                </div>
            </main>
        );
}