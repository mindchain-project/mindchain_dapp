import HistoryTable from '@/components/shared/HistoryTable';

const History = () => {

  return (
    <section className="space-y-4 justify-self-center">
      <h3 className="text-xl font-semibold gradient-text">Historique</h3>
      <p className="text-muted-foreground">Consultez vos certificats.</p>
      <HistoryTable />
    </section>
  )
}

export default History