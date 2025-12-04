import React from 'react'


interface GenerationProps {
  address: string;
}

const Generation = (props: GenerationProps) => {

  return (
     <section className="space-y-4 justify-self-center">
        <h3 className="text-xl font-semibold gradient-text">Génération d&apos;une oeuvre</h3>
        <p className="text-muted-foreground w-full">Remplissez le formulaire ci-dessous pour générer une création avec l&apos;IA.</p>
    </section>
  )
}

export default Generation