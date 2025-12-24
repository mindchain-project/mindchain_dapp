import MemberForm from '@/components/shared/forms/MemberForm';

const Member = () => {
  return (
    <>
    <h2 className='highlight text-center'>Tableau de bord</h2>
    <div className="mt-8">
      <MemberForm />
    </div>
    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
    <div className='mt-2 border-green-500 p-2 text-center text-green-500 bg-green-100 rounded'>Espace de vote bientôt disponible !</div>
    </>
);
};

export default Member;