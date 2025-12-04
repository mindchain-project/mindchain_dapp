import React from 'react'

interface HistoryProps {
  address: string;
}

const History = (props: HistoryProps) => {
    console.log("History props:", props);
  return (
    <section className="space-y-4 justify-self-center">
        <h3 className="text-xl font-semibold gradient-text">Historique</h3>
        <p className="text-muted-foreground">Consultez vos opérations et certificats passés.</p>
        <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Opération</th>
                    <th className="border border-gray-300 px-4 py-2">Statut</th>  
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border border-gray-300 px-4 py-2">2025-11-01</td>
                    <td className="border border-gray-300 px-4 py-2">Certification de l&apos;oeuvre "Sunset"</td>
                    <td className="border border-gray-300 px-4 py-2">Validé</td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-2">2024-11-20</td>
                    <td className="border border-gray-300 px-4 py-2">Certification de l&apos;oeuvre "Chat sauvage"</td>
                    <td className="border border-gray-300 px-4 py-2">Validé</td>
                </tr>
            </tbody>
        </table>
    </section>
  )
}

export default History