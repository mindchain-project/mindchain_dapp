import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <section className="section-home">
          <h1 className="text-4xl font-bold mb-8 gradient-text">Certifier votre création IA</h1>
          <Image
            src="/mindchain_token.png"
            alt="MindChain Token"
            width={400}
            height={400}
            className="border-4 border-blue-400 rounded-lg"
          />
          <p className="text-lg p-5 text-center font-bold">
            Preuve d&apos;authenticité on chain.
          </p>
        </section>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
        <section className="mt-10 section-home">
          <h2 className="text-2xl font-semibold mb-4">Découvrir Mindchain</h2>
          <p>Gratuitement</p>
          <button className="btn-action mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <Link href="/studio">Essayer la version test</Link>
          </button>
        </section>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
        <section className="mt-10 section-home">
          <h2 className="text-2xl font-semibold mb-4">Pourquoi Mindchain</h2>
            <p className="highlight">
            Première solution blockchain certifiant l&apos;authenticité et la traçabilité d&apos;une oeuvre créée avec l&apos;assistance de l&apos;IA.
            </p>
          <p className="my-5">Aujourd&apos;hui, images, vidéos, designs et textes peuvent être générés en quelques secondes, sans contexte, sans auteur, sans origine traçable.</p>
          <p className="my-5">Les créateurs perdent leur attribution.<br/>
          Les marques perdent leur authenticité.<br/>
          Les plateformes perdent la confiance.<br/>
          Le public ne sait plus distinguer le réel du synthétique.</p>
          <p className="my-5">La création explose. La preuve disparait.</p>
          <Image src="/icons/arrow-down.svg" alt="arrow_down" width={50} height={50} className="gradient-arrow"/>
          <h2 className="text-2xl font-semibold mb-4">Proposition Mindchain</h2>
          <p>Traçabilité de tout le processus créatif avec l&apos;IA</p>
          <p>Enregistrement blockain infalsifiable et immuable</p>
          <p>Emission d&apos;un certificat d&apos;authenticité et de traçabilité</p>
          <p>Progammabilité et interopérabilité</p>
        </section>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
        <section className="mt-10 section-home">
          <h2 className="text-2xl font-semibold mb-4">Comment ça marche ?</h2>
          <p>Un protocole de confiance unique de la création à la vérification.</p>
          <ul>
            <li>
              <h3>Enregistrement</h3>
              <p>MindChain enregistre les événements choisis:<br /> prompts, fichiers sources, itération, versions de modèles IA, oeuvre finale.</p>
            </li>
            <li>
              <h3>Hachage & Signature</h3>
              <p>Les données restent privées. MindChain ne traite que des hashes et signatures cryptographiques.</p>
            </li>
            <li>
              <h3>Preuves On-Chain</h3>
              <p>Les preuves sont ancrées sur une blockchain compatible EVM Polygon pour plus de vitesse, de flexibilité et de faible coût.</p>
            </li>
            <li>
              <h3>Vérification Universelle </h3>
              <p>via un Certificate Token.</p>
            </li>
          </ul>
        </section>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
        <section className="mt-10 section-home">
          <h2 className="text-2xl font-semibold mb-4">Cas d&apos;usage</h2>
          <ul className="ml-8 py-8">
            <li className="py-4">Prouver la contribution humaine dans les workflows IA.</li>
            <li className="py-4">Certifier datasets, modèles et sources d&apos;entraînement.</li>
            <li className="py-4">Tracer retouches, modifications et itérations.</li>
            <li className="py-4">Authentifier images, vidéos, audio, textes, 3D, code.</li>
            <li className="py-4">Afficher des badges d&apos;authenticité pour marketplaces.</li>
            <li className="py-4">Sécuriser les pipelines créatifs des marques.</li>
            <li className="py-4">Assurer la conformité des contenus IA.</li>
            <li className="py-4">Mettre en place des contrats de co-création & royalties.</li>
          </ul>
        </section>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
        <section className="mt-10 section-home">
          <h2 className="text-2xl font-semibold mb-4">Pour qui</h2>
          <ul>
            <li><h3>Créateurs</h3><p>Protégez vos œuvres et prouvez votre originalité.</p></li>
            <li><h3>Marques & Studios</h3><p>Garantissez l&apos;authenticité de vos contenus et workflows.</p></li>
            <li><h3>Plateformes d’IA</h3><p>Offrez à vos utilisateurs une preuve d&apos;origine vérifiable.</p></li>
            <li><h3>Institutions Culturelles</h3><p>Certifiez la provenance des collections et archives numériques.</p></li>
            <li><h3>Marketplaces</h3><p>Affichez des badges d&apos;authenticité, luttez contre les copies et augmentez la confiance.</p></li>
          </ul>
        </section>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-10 rounded"></div>
        <section className="mt-10 section-home">
          <h2 className="text-2xl font-semibold mb-4">La vision</h2>
          <p>Un écosystème créatif digne de confiance pour l&apos;ère de l’IA.</p>
          <p>L&apos;intelligence artificielle transforme radicalement la création. Mais la confiance n&apos;a pas suivi.</p>
          <p>MindChain vise à devenir le standard mondial d&apos;authenticité : adopté par les créateurs, les plateformes, les studios, les institutions et les agents IA.</p>
          <p>Nous croyons que le futur du contenu généré par IA doit être un futur où l&apos;origine est vérifiable, la provenance transparente et les systèmes responsables.</p>
          <p className="highlight">
            Mindchain ne construit pas seulement une technologie.
            <br />Nous construisons la confiance.
          </p>
          <button className="btn-action mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Devenez partenaire</button>
        </section>
      </main>
  );
}
