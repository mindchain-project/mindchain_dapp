// src/app/legals/cgu.tsx
// Même structure que MentionsPage et PolitiquePage (wrapper .legals, sections numérotées)

const CGUPage = () => {
  return (
    <div className="legals">
      <h1>CONDITIONS GÉNÉRALES D’UTILISATION (CGU)</h1>
      <p>
        <strong>MindChain</strong> est une plateforme Web3 de certification permettant d’émettre un{" "}
        <strong>Certificate Token (CT)</strong> attestant l’authenticité, l’antériorité et l’intégrité
        cryptographique d’un processus créatif assisté par l’IA.
      </p>

      <p>
        MindChain ne stocke jamais de manière permanente les prompts, fichiers sources ni les CID,
        et n’a aucune visibilité humaine sur les contenus envoyés.
      </p>

      <section>
        <h2 className="before:content-['1._'] before:mr-2">Objet</h2>
        <p>Les présentes CGU définissent :</p>
        <ul>
          <li>les conditions d’accès et d’utilisation de MindChain ;</li>
          <li>les obligations légales et techniques de la certification ;</li>
          <li>la répartition des responsabilités entre l’utilisateur et MindChain ;</li>
          <li>les règles en matière de propriété intellectuelle, deepfakes et contenus IA ;</li>
          <li>les engagements RGPD et IA Act.</li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['2._'] before:mr-2">Définitions</h2>
        <ul>
          <li><strong>Utilisateur</strong> : personne utilisant la Plateforme.</li>
          <li><strong>Création assistée par IA</strong> : tout contenu généré via un outil d’IA.</li>
          <li><strong>Processus créatif</strong> : prompts, fichiers, paramètres IA.</li>
          <li>
            <strong>Certificate Token (CT)</strong> : certificat on-chain non transférable attestant
            l’antériorité d’une création.
          </li>
          <li>
            <strong>Stockage temporaire</strong> : phase technique très courte (quelques secondes à
            minutes) dans une base SQL sécurisée, chiffrée, non consultable par un humain.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['3._'] before:mr-2">Accès à la plateforme</h2>
        <ul>
          <li>L’accès est gratuit.</li>
          <li>
            Certaines fonctionnalités (ex. génération de CT) peuvent être soumises à paiement
            (crypto ou carte bancaire).
          </li>
          <li>L’utilisateur doit disposer :</li>
        </ul>
        <ul>
          <li>d’un navigateur compatible ;</li>
          <li>d’un wallet Web3 (ou d’un compte utilisateur classique) ;</li>
          <li>de la capacité juridique nécessaire.</li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['4._'] before:mr-2">Utilisation du service</h2>

        <h3 className="before:content-['4.1._'] before:mr-2">Fonctionnement du CT</h3>
        <p>L’utilisateur transmet les éléments nécessaires à la certification.</p>
        <p>MindChain exécute automatiquement le flux suivant :</p>
        <ul>
          <li>Stockage temporaire automatisé, chiffré, non accessible à un humain.</li>
          <li>Génération automatique du hash du processus créatif.</li>
          <li>Inscription immuable du hash dans un smart contract ERC-721 (CT).</li>
          <li>Purge automatique et irréversible de :</li>
        </ul>
        <ul>
          <li>prompts ;</li>
          <li>fichiers sources ;</li>
          <li>CID ;</li>
          <li>logs créatifs ;</li>
          <li>clés éphémères associées.</li>
        </ul>
        <p>
          Aucune équipe humaine ne peut consulter, restaurer ou analyser ces données.
        </p>
      </section>

      <section>
        <h2 className="before:content-['5._'] before:mr-2">Propriété intellectuelle</h2>

        <h3 className="before:content-['5.1._'] before:mr-2">Responsabilité totale de l’utilisateur</h3>
        <p>
          MindChain ne voit jamais les contenus, ne peut pas effectuer de contrôle et ne joue aucun
          rôle éditorial.
        </p>
        <p>L’utilisateur certifie qu’il détient tous les droits nécessaires sur :</p>
        <ul>
          <li>les contenus générés par IA ;</li>
          <li>les fichiers envoyés ;</li>
          <li>les styles artistiques utilisés (« à la façon de ») ;</li>
          <li>les visages ou identités exploités ;</li>
          <li>les œuvres dérivées potentielles.</li>
        </ul>
        <p>
          Toute violation de droits d’auteur ou du droit à l’image relève exclusivement de
          l’utilisateur.
        </p>

        <h3 className="before:content-['5.2._'] before:mr-2">Interdictions</h3>
        <p>L’utilisateur s’engage à ne soumettre aucun contenu potentiellement :</p>
        <ul>
          <li>contrefaisant (ex. utilisation du style d’un artiste protégé) ;</li>
          <li>imitant une personne réelle sans consentement ;</li>
          <li>constituant un deepfake illicite ;</li>
          <li>portant atteinte au droit moral d’un créateur ;</li>
          <li>inspiré de manière substantielle d’une œuvre protégée.</li>
        </ul>
        <p>
          MindChain ne pouvant vérifier ces éléments, l’utilisateur certifie sous sa propre
          responsabilité leur conformité.
        </p>

        <h3 className="before:content-['5.3._'] before:mr-2">Droits conservés</h3>
        <p>
          MindChain n’acquiert aucun droit sur les œuvres ni sur les éléments du processus créatif.
        </p>
        <p>
          La licence accordée à MindChain est purement technique, non exclusive, limitée au temps
          nécessaire à la génération du CT.
        </p>
        <p>L’utilisateur conserve 100 % des droits sur ses créations.</p>

        <h3 className="before:content-['5.4._'] before:mr-2">Droits de propriété MindChain</h3>
        <p>
          Les éléments de la Plateforme (texte, logo, architecture technique, smart contracts)
          restent la propriété exclusive de MindChain.
        </p>
      </section>

      <section>
        <h2 className="before:content-['6._'] before:mr-2">Responsabilité liée à l’IA</h2>

        <h3 className="before:content-['6.1._'] before:mr-2">Risques liés aux contenus IA</h3>
        <p>
          L’utilisateur reconnaît que les créations assistées par IA peuvent contenir des contenus
          illicites, erreurs, hallucinations ou métadonnées fausses.
        </p>
        <p>
          MindChain ne peut ni détecter, ni filtrer, ni corriger ces éléments. Toute responsabilité
          incombe exclusivement à l’utilisateur.
        </p>
        <p>
          En matière de deepfakes et d’usurpation d’identité, l’utilisateur doit disposer des
          consentements requis conformément à l’IA Act européen.
        </p>

        <h3 className="before:content-['6.2._'] before:mr-2">Statut juridique de MindChain</h3>
        <p>MindChain agit en simple intermédiaire technique :</p>
        <ul>
          <li>n’est pas éditeur ;</li>
          <li>n’est pas modérateur ;</li>
          <li>n’a pas accès aux contenus créatifs.</li>
        </ul>
        <p>
          Elle est assimilée à un hébergeur technique automatisé (directive eCommerce, DSA, futur IA
          Act).
        </p>

        <h3 className="before:content-['6.3._'] before:mr-2">Obligations légales respectées</h3>
        <ul>
          <li>Filtrage automatisé minimal pré-upload (sans intervention humaine).</li>
          <li>Blocage automatique en cas de risque élevé détecté.</li>
          <li>Déclaration explicite de responsabilité exclusive de l’utilisateur.</li>
          <li>Purge automatique garantissant l’absence de traitement humain.</li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['7._'] before:mr-2">Protection des données (RGPD)</h2>
        <h3>7.1 Données collectées</h3>
        <ul>
          <li>Adresse du wallet ;</li>
          <li>nonce et timestamp de signature ;</li>
          <li>consentement RGPD ;</li>
          <li>données strictement nécessaires à la génération du CT ;</li>
          <li>logs techniques temporaires.</li>
        </ul>

        <h3>7.2 Aucune conservation du processus créatif</h3>
        <p>
          MindChain ne stocke jamais prompts IA, fichiers sources ou hashes créatifs après la
          génération du CT.
        </p>

        <h3>7.3 Durées de conservation</h3>
        <ul>
          <li>Données CT : on-chain, immuables.</li>
          <li>Logs techniques : quelques heures à 30 jours maximum.</li>
          <li>Consentement RGPD : tant que le compte ou wallet est actif.</li>
        </ul>

        <h3>7.4 Droits de l’utilisateur</h3>
        <p>
          Exercice des droits :{" "}
          <a href="mailto:privacy@mindchain.xyz">privacy@mindchain.xyz</a>
        </p>
      </section>

      <section>
        <h2 className="before:content-['8._'] before:mr-2">Sécurité</h2>
        <ul>
          <li>Chiffrement des données temporaires ;</li>
          <li>smart contracts audités ;</li>
          <li>purge automatisée ;</li>
          <li>journaux pseudonymisés.</li>
        </ul>
        <p>L’utilisateur reste responsable de la sécurité de son wallet.</p>
      </section>

      <section>
        <h2 className="before:content-['9._'] before:mr-2">Limitation de responsabilité</h2>
        <p>
          MindChain ne peut être tenue responsable de l’illégalité, de la nature ou des conséquences
          des contenus qu’elle n’a jamais vus.
        </p>
        <p>
          Le CT constitue une preuve technique d’antériorité et d’intégrité, et non une garantie
          juridique absolue.
        </p>
      </section>

      <section>
        <h2 className="before:content-['10._'] before:mr-2">Modifications des CGU</h2>
        <p>
          MindChain se réserve le droit de modifier les CGU. Les utilisateurs seront informés de
          toute mise à jour majeure.
        </p>
      </section>

      <section>
        <h2 className="before:content-['11._'] before:mr-2">Loi applicable</h2>
        <p>
          Les présentes CGU sont soumises au droit français. Les litiges relèvent de la compétence
          exclusive des tribunaux français.
        </p>
      </section>

      <section>
        <h2 className="before:content-['12._'] before:mr-2">Contact</h2>
        <p>
          <a href="mailto:legal@mindchain.xyz">legal@mindchain.xyz</a>
        </p>
      </section>
    </div>
  );
};

export default CGUPage;
