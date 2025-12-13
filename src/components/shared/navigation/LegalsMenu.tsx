import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionSection() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue=""
      id="cgu"
    >
      <AccordionItem className="px-2" value="item-1">
        <AccordionTrigger><h3>CONDITIONS GÉNÉRALES D’UTILISATION (CGU) - MINDCHAIN</h3></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
            <section id="cgu-policy">

            <p>
                MindChain est une plateforme Web3 de certification permettant d’émettre un
                <strong>Certificate Token (CT)</strong> attestant l&apos;authenticité,
                l&apos;antériorité et l&apos;intégrité cryptographique d’un processus créatif
                assisté par l&apos;IA.
            </p>
            <p>
                MindChain ne stocke jamais de manière permanente les prompts, fichiers sources
                ni les CID, et n&apos;a aucune visibilité humaine sur les contenus envoyés.
            </p>

            <h4>1. OBJET</h4>
            <p>Les présentes CGU définissent :</p>
            <ul>
                <li>les conditions d&apos;accès et d&apos;utilisation de MindChain ;</li>
                <li>les obligations légales et techniques de la certification ;</li>
                <li>la répartition des responsabilités entre l&apos;utilisateur et MindChain ;</li>
                <li>les règles en matière de propriété intellectuelle, deepfakes et contenus IA ;</li>
                <li>les engagements RGPD et IA Act.</li>
            </ul>

            <h4>2. DÉFINITIONS</h4>
            <p>Utilisateur : personne utilisant la Plateforme.</p>
            <ul>
                <li>Création assistée par IA : tout contenu généré via un outil d’IA.</li>
                <li>Processus créatif : prompts, fichiers, paramètres IA.</li>
                <li>
                Certificate Token (CT) : certificat on-chain non transférable attestant
                l’antériorité d’une création.
                </li>
                <li>
                Stockage temporaire : phase technique très courte (quelques secondes à minutes)
                dans une base SQL sécurisée, chiffrée, non consultable par un humain.
                </li>
            </ul>

            <h4>3. ACCÈS À LA PLATEFORME</h4>
            <p>L&apos;accès est gratuit.</p>
            <p>
                Certaines fonctionnalités (ex. génération de CT) peuvent être soumises à paiement
                (crypto ou carte bancaire).
            </p>
            <p>L’utilisateur doit disposer :</p>
            <ul>
                <li>d’un navigateur compatible ;</li>
                <li>d’un wallet Web3 (ou d’un compte utilisateur classique) ;</li>
                <li>de la capacité juridique nécessaire.</li>
            </ul>

            <h4>4. UTILISATION DU SERVICE</h4>
            <h5>4.1 Fonctionnement du CT</h5>
            <p>L’utilisateur transmet les éléments nécessaires à la certification.</p>
            <p>MindChain exécute automatiquement le flux suivant :</p>
            <ol>
                <li>Stockage temporaire automatisé, chiffré, non accessible à un humain.</li>
                <li>Génération automatique du hash du processus créatif.</li>
                <li>Inscription immuable du hash dans un smart contract ERC-721 (CT).</li>
                <li>
                Purge automatique et irréversible de :
                <ul>
                    <li>prompts</li>
                    <li>fichiers sources</li>
                    <li>CID</li>
                    <li>logs créatifs</li>
                    <li>clés éphémères associées</li>
                </ul>
                </li>
            </ol>
            <p>
                Aucune équipe humaine ne peut consulter, restaurer ou analyser ces données.
            </p>

            <h4>5. PROPRIÉTÉ INTELLECTUELLE</h4>

            <h5>5.1 Responsabilité totale de l’utilisateur</h5>
            <p>
                MindChain ne voit jamais les contenus, ne peut pas effectuer de contrôle
                et ne joue aucun rôle éditorial.
            </p>
            <p>L’utilisateur certifie qu’il détient tous les droits nécessaires sur :</p>
            <ul>
                <li>les contenus générés par IA,</li>
                <li>les fichiers envoyés,</li>
                <li>les styles artistiques utilisés (« à la façon de »),</li>
                <li>les visages ou identités exploités,</li>
                <li>les œuvres dérivées potentielles.</li>
            </ul>
            <p>
                Toute violation de droits d’auteur ou du droit à l’image relève exclusivement
                de l’utilisateur.
            </p>

            <h5>5.2 Interdictions</h5>
            <p>L’utilisateur s’engage à ne soumettre aucun contenu :</p>
            <ul>
                <li>contrefaisant (ex. utilisation du style d’un artiste protégé) ;</li>
                <li>imitant une personne réelle sans consentement ;</li>
                <li>constituant un deepfake illicite ;</li>
                <li>portant atteinte au droit moral d’un créateur ;</li>
                <li>inspiré de manière substantielle d’une œuvre protégée.</li>
            </ul>
            <p>
                MindChain ne pouvant vérifier ces éléments, l&apos;utilisateur certifie
                sous sa propre responsabilité leur conformité.
            </p>

            <h5>5.3 Droits conservés</h5>
            <p>
                MindChain n&apos;acquiert aucun droit sur les œuvres ni sur les éléments
                du processus créatif.
            </p>
            <p>
                La licence accordée à MindChain est purement technique, non exclusive,
                limitée au temps nécessaire à la génération du CT.
            </p>
            <p>L’utilisateur conserve 100 % des droits sur ses créations.</p>

            <h5>5.4 Droits de propriété MindChain</h5>
            <p>
                Les éléments de la Plateforme (texte, logo, architecture technique,
                smart contracts) restent la propriété exclusive de MindChain.
            </p>

            <h4>6. RESPONSABILITÉ LIÉE À L’IA</h4>

            <h5>6.1 Risques liés aux contenus IA</h5>
            <p>L’utilisateur reconnaît que les créations assistées par IA peuvent contenir :</p>
            <ul>
                <li>des contenus illicites,</li>
                <li>des erreurs, hallucinations ou métadonnées fausses,</li>
                <li>des deepfakes ou usurpations d’identité.</li>
            </ul>
            <p>
                MindChain ne peut ni détecter ni filtrer ces contenus.
                Toute responsabilité incombe exclusivement à l’utilisateur.
            </p>

            <h5>6.2 Statut juridique de MindChain</h5>
            <p>MindChain agit en simple intermédiaire technique :</p>
            <ul>
                <li>non éditeur,</li>
                <li>non modérateur,</li>
                <li>sans accès aux contenus créatifs.</li>
            </ul>

            <h5>6.3 Obligations légales respectées</h5>
            <p>MindChain met en place :</p>
            <ul>
                <li>un filtrage automatisé minimal pré-upload,</li>
                <li>une interdiction stricte des deepfakes non consentis,</li>
                <li>une purge automatique garantissant l’absence de traitement humain.</li>
            </ul>

            <h4>7. PROTECTION DES DONNÉES (RGPD)</h4>

            <h5>7.1 Données collectées</h5>
            <ul>
                <li>adresse du wallet,</li>
                <li>nonce et timestamp de signature,</li>
                <li>consentement RGPD,</li>
                <li>données strictement nécessaires à la génération du CT,</li>
                <li>logs techniques temporaires.</li>
            </ul>

            <h5>7.2 Aucune conservation du processus créatif</h5>
            <p>MindChain ne stocke jamais :</p>
            <ul>
                <li>prompts IA,</li>
                <li>fichiers sources,</li>
                <li>hash du processus créatif après génération du CT.</li>
            </ul>

            <h5>7.3 Durées de conservation</h5>
            <ul>
                <li>données du CT : on-chain, immuables ;</li>
                <li>logs techniques : purgés automatiquement ;</li>
                <li>consentement RGPD : conservé tant que le compte est actif.</li>
            </ul>

            <h5>7.4 Droits de l’utilisateur</h5>
            <p>
                L’utilisateur peut exercer ses droits via :
                <strong>privacy@mindchain.xyz</strong>
            </p>

            <h4>8. SÉCURITÉ</h4>
            <ul>
                <li>chiffrement des données temporaires ;</li>
                <li>smart contracts audités ;</li>
                <li>purge automatisée ;</li>
                <li>journaux pseudonymisés.</li>
            </ul>

            <h4>9. LIMITATION DE RESPONSABILITÉ</h4>
            <p>
                Le CT constitue une preuve d’intégrité et d’antériorité,
                non une garantie juridique absolue.
            </p>

            <h4>10. MODIFICATIONS DES CGU</h4>
            <p>MindChain se réserve le droit de modifier les CGU.</p>

            <h4>11. LOI APPLICABLE</h4>
            <p>Les présentes CGU sont soumises au droit français.</p>

            <h4>12. CONTACT</h4>
            <p>📧 <em>legal@mindchain.xyz</em></p>

            </section>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="px-2" value="item-2">
        <AccordionTrigger><h3>POLITIQUE RGPD — VERSION JURIDIQUE RENFORCÉE</h3></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <section id="rgpd-policy">
            <h4>Responsabilités, périmètre et cadre légal</h4>
            <p>
                La présente politique synthétise la manière dont <strong>MindChain</strong>, en qualité de
                <strong>Responsable de traitement</strong>, met en œuvre les traitements strictement nécessaires
                à la délivrance de son service de certification blockchain.
            </p>
            <p>
                MindChain applique les principes du <strong>Règlement (UE) 2016/679 (RGPD)</strong>,
                du <strong>privacy by design</strong> et de la <strong>minimisation des données</strong>,
                et ne traite aucune donnée excédant ce qui est indispensable à l’exécution du service.
            </p>

            <h4>1. Nature du traitement et périmètre des responsabilités</h4>
            <p>MindChain intervient exclusivement pour :</p>
            <ul>
                <li>authentifier techniquement l’utilisateur,</li>
                <li>générer un certificat de preuve,</li>
                <li>assurer la traçabilité blockchain,</li>
                <li>respecter les obligations légales de sécurité et de conservation.</li>
            </ul>
            <p>
                MindChain <strong>n’accède à aucun contenu créatif</strong>, ni directement ni indirectement.
            </p>
            <p>
                Toutes les données relatives à l’œuvre, aux fichiers, aux étapes, aux métadonnées ou aux hashes
                créatifs demeurent entièrement <strong>hors du périmètre de traitement</strong> et sous la seule
                responsabilité de l’utilisateur.
            </p>

            <h4>2. Données effectivement traitées par MindChain</h4>
            <p>
                MindChain ne traite que des données strictement limitées, encadrées et non exploitables
                pour identifier le contenu créatif.
            </p>

            <h5>2.1. Données pseudonymisées (temporairement traitées)</h5>
            <ul>
                <li><strong>User ID interne</strong> : identifiant technique non nominatif</li>
                <li><strong>Email ou wallet</strong> : immédiatement pseudonymisés par hachage (SHA-256)</li>
                <li><strong>Durée</strong> : supprimés dès validation de la certification</li>
            </ul>

            <h5>2.2. Données de certification (conservées)</h5>
            <p>
                Ces données n’ont aucune portée créative ; elles garantissent uniquement la preuve de certification.
            </p>
            <ul>
                <li>ID certificat (UUID)</li>
                <li>Hash de transaction blockchain</li>
                <li>Titre du certificat (référence administrative non créative)</li>
                <li>Date de création</li>
                <li>Version du protocole</li>
            </ul>
            <p><strong>Durée de conservation :</strong> 3 ans</p>

            <h5>2.3. Données légales et techniques</h5>
            <ul>
                <li>Journaux de sécurité et de conformité</li>
                <li>Preuves de paiement (sans données bancaires)</li>
            </ul>
            <p>
                <strong>Durée de conservation :</strong><br />
                Logs légaux : 1 an<br />
                Preuves comptables : 10 ans (obligation légale)
            </p>
            <p><strong>Aucune autre donnée n’est collectée ni conservée.</strong></p>

            <h4>3. Données que MindChain n’exploite pas</h4>
            <p>MindChain ne collecte, ne stocke, ne transfère et ne traite aucune des données suivantes :</p>
            <ul>
                <li>fichiers, œuvres, contenus créatifs, images, textes, audio, vidéos,</li>
                <li>étapes du processus créatif, instructions, dialogues, historiques,</li>
                <li>hashes créatifs intermédiaires ou finaux,</li>
                <li>fichier JSON de métadonnées,</li>
                <li>informations sensibles ou identifiantes au-delà de l’authentification pseudonymisée.</li>
            </ul>
            <p>
                <strong>Aucun traitement automatisé du contenu, aucune analyse, aucun profilage.</strong>
            </p>

            <h4>4. Base légale des traitements</h4>
            <p>Les traitements mis en œuvre par MindChain reposent exclusivement sur :</p>
            <ul>
                <li>Article 6.1.b RGPD (exécution d’un contrat),</li>
                <li>Article 6.1.c RGPD (obligations légales),</li>
                <li>Article 6.1.f RGPD (intérêt légitime : sécurité, prévention de fraude),</li>
                <li>Consentement explicite de l’utilisateur pour l’émission du certificat.</li>
            </ul>

            <h4>5. Sécurité et garanties</h4>
            <p>MindChain applique des mesures techniques de niveau élevé :</p>
            <ul>
                <li>pseudonymisation systématique des identifiants,</li>
                <li>suppression automatique après certification,</li>
                <li>journalisation sécurisée,</li>
                <li>aucune réidentification possible sans intervention de l’utilisateur,</li>
                <li>aucune exploitation commerciale, publicitaire ou analytique.</li>
            </ul>
            <p>
                MindChain n’effectue aucun transfert non autorisé et ne partage des données
                <strong>qu’en cas d’obligation légale valable</strong>.
            </p>

            <h4>6. Droits de l’utilisateur</h4>
            <p>
                L’utilisateur bénéficie des droits d’accès, rectification, effacement, limitation et opposition
                dans les limites compatibles avec l’immutabilité de la blockchain.
            </p>
            <p>
                Pour toute demande :<br />
                📧 <em>legal@mindchain.xyz</em>
            </p>

            <h4>7. Engagement de souveraineté</h4>
            <p>
                MindChain garantit que les données conservées sont exclusivement techniques, limitées et
                proportionnées, et qu’aucun élément lié à la création, à l’identité ou au contenu
                ne transite ni ne demeure dans son système.
            </p>
            <p>
                MindChain se définit comme un <strong>tiers de confiance minimaliste</strong>,
                dont l’intervention est strictement circonscrite à l’émission d’une preuve,
                sans captation, sans indexation et sans dépendance vis-à-vis de l’utilisateur.
            </p>

            <p><strong>
                MindChain — une conformité juridique exigeante, un traitement minimaliste,
                une protection absolue de votre espace créatif.
            </strong></p>
        </section>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="px-2"  value="item-3">
        <AccordionTrigger><h3>MENTIONS LÉGALES</h3></AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
         <section id="legal-notice">
        <h4>1. Informations générales</h4>
            <p>
                Le site <strong>MindChain</strong> est édité par :
            </p>
            <ul>
                <li><strong>[Nom de la société]</strong></li>
                <li>Société immatriculée en France sous le numéro <strong>[SIREN/SIRET]</strong></li>
                <li>Siège social : <strong>[Adresse]</strong></li>
                <li>Email de contact : <strong>[contact@…]</strong></li>
                <li>Directeur de la publication : le représentant légal de la société</li>
            </ul>
            <h4>2. Hébergement</h4>
            <p>
                Le site est hébergé auprès d’un prestataire conforme aux obligations de sécurité
                et de protection des données imposées par la réglementation européenne.
            </p>
            <p>
                Les coordonnées complètes de l’hébergeur sont tenues à disposition des autorités
                compétentes en cas de réquisition légale.
            </p>

            <h4>3. Description synthétique du service</h4>
            <p>
                MindChain met à disposition des utilisateurs un service permettant :
            </p>
            <ul>
                <li>de générer un certificat attestant de la création ou de l’existence d’une œuvre à un instant donné ;</li>
                <li>de consulter ses certifications passées dans un espace utilisateur.</li>
            </ul>
            <p>
                MindChain <strong>ne fournit aucun service de création d’œuvres</strong> et
                <strong>n’intervient pas dans leur élaboration</strong>.
            </p>
            <p>
                MindChain <strong>n’héberge aucun contenu créatif</strong> et
                <strong>ne stocke aucune information permettant d’accéder, de reproduire
                ou d’analyser le processus créatif</strong> d’un utilisateur.
            </p>

            <h4>4. Propriété intellectuelle</h4>
            <p>
                Le site, son identité visuelle, ses éléments rédactionnels, ses modèles,
                sa logique conceptuelle ainsi que l’ensemble des éléments relevant du service
                MindChain sont protégés par le droit de la propriété intellectuelle.
            </p>
            <p>
                Toute reproduction, diffusion ou extraction, totale ou partielle,
                sans autorisation écrite préalable, est strictement interdite.
            </p>
            <p>
                MindChain <strong>ne revendique aucun droit</strong> sur les créations certifiées
                par les utilisateurs.
            </p>

            <h4>5. Responsabilité</h4>
            <p>MindChain ne peut être tenu responsable :</p>
            <ul>
                <li>de l’exactitude des informations communiquées par l’utilisateur ;</li>
                <li>de l’usage, de la nature ou de la licéité des œuvres que l’utilisateur choisit de certifier ;</li>
                <li>
                des conséquences techniques ou économiques liées à l’utilisation de solutions
                ou outils externes (wallets, applications tierces, plateformes externes) ;
                </li>
                <li>
                des interruptions, ralentissements ou dysfonctionnements liés à l’infrastructure,
                au réseau ou aux technologies utilisées.
                </li>
            </ul>
            <p>
                MindChain ne modère pas les créations de l’utilisateur, n’y accède pas
                et n’est pas en mesure de les analyser.
            </p>

            <h4>6. Données personnelles</h4>
            <p>
                MindChain adopte une politique de <strong>minimisation stricte</strong> :
                seules les données indispensables à l’accès au service et à l’affichage
                des certifications sont conservées.
            </p>
            <p>
                Les catégories de données collectées sont décrites dans la
                <strong>Politique de Confidentialité</strong> accessible sur le site.
            </p>
            <p>
                MindChain ne conserve aucune donnée permettant de reconstituer une œuvre,
                de comprendre son processus de création ou d’exploiter son contenu.
            </p>
            <p>
                MindChain ne transmet aucune donnée à des tiers,
                <strong>hors obligations légales</strong>.
            </p>

            <h4>7. Logs légaux</h4>
            <p>
                Conformément à la réglementation en vigueur, les journaux techniques nécessaires
                à la sécurité et à la conformité du service sont conservés pour une durée maximale
                d’un an.
            </p>

            <h4>8. Liens vers des services tiers</h4>
            <p>
                MindChain peut contenir des liens vers des services externes.
            </p>
            <p>
                Le contenu, le fonctionnement et la sécurité de ces services
                ne relèvent pas de la responsabilité de MindChain.
            </p>

            <h4>9. Modifications</h4>
            <p>
                Les présentes mentions légales peuvent être modifiées à tout moment.
            </p>
            <p>
                La version applicable est celle publiée sur le site au moment de la consultation.
            </p>

            <h4>10. Droit applicable</h4>
            <p>
                Le présent site est soumis au <strong>droit français</strong>.
            </p>
            <p>
                Tout litige relatif à son utilisation relève de la compétence
                des juridictions françaises compétentes.
            </p>
            </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
