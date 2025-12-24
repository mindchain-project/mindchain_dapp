import CGUPage from "./cgu";
import PolitiquePage from "./politique";
import MentionsPage from "./mentions";

type LegalsPageProps = {
  searchParams: Promise<{
    section?: string;
  }>;
};

export default async function Legals({ searchParams }: LegalsPageProps) {
  const { section } = await searchParams;
  return (
    <section className='container mx-auto p-5 space-y-10 w-[80%]'>
      {section === 'cgu' && <CGUPage />}
      {section === 'politique' && <PolitiquePage />}
      {section === 'mentions' && <MentionsPage />}
    </section>
  );
};
