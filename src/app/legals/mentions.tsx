
const MentionsPage = () => {
  return (
    <div className="legals">
    <h1>MENTIONS LÉGALES</h1>
      <section>
        <h2 className="before:content-['1._'] before:mr-2">Informations générales</h2>
        <p>Le site web et la plateforme MindChain sont édités par <strong>MindChain SAS</strong>.</p>
        <ul>
          <li>Société immatriculée en France sous le numéro <strong>[SIREN/SIRET]</strong></li>
          <li>Siège social : <strong>8 rue du Bonheur, 75001 Paris</strong></li>
          <li>Email de contact : <a href="mailto:contact@mindchain.com">contact@mindchain.com</a></li>
          <li>Directeur de la publication : <strong>Le représentant légal de la société</strong></li>
          <li>Capital social : <strong>[à compléter]</strong> euros</li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['2._'] before:mr-2">Hébergement</h2>
        <p>
          Le site et la plateforme MindChain sont hébergés auprès d&apos;un prestataire conforme aux obligations de sécurité et
          de protection des données imposées par la réglementation européenne (RGPD).
        </p>
        <p><strong>Hébergeur :</strong> AWS</p>
        <p>
          Les coordonnées complètes de l&apos;hébergeur sont tenues à disposition des autorités compétentes en cas de
          réquisition judiciaire conformément à l&apos;article 6-II de la loi n° 2004-575 du 21 juin 2004 pour la confiance
          dans l&apos;économie numérique (LCEN).
        </p>
      </section>

      <section>
        <h2 className="before:content-['3._'] before:mr-2">Description synthétique du service</h2>
        <p>MindChain met à disposition des utilisateurs un service de certification blockchain permettant :</p>
        <ul>
          <li>De générer un certificat attestant de la création ou de l&apos;existence d&apos;une œuvre à un instant donné</li>
          <li>D&apos;enregistrer une empreinte cryptographique (hash) de l&apos;œuvre sur une blockchain publique</li>
          <li>De consulter ses certifications passées dans un espace utilisateur sécurisé</li>
          <li>D&apos;obtenir une preuve horodatée et infalsifiable de l&apos;antériorité d&apos;une création</li>
        </ul>

        <h3 className="before:content-['3.1._'] before:mr-2">Limites du service</h3>
        <ul>
          <li>MindChain ne fournit aucun service de création d&apos;œuvres et n&apos;intervient pas dans leur élaboration.</li>
          <li>
            MindChain n&apos;héberge aucun contenu créatif. Les œuvres, fichiers, contenus créatifs restent entièrement sous la
            responsabilité et le contrôle exclusif de l&apos;utilisateur.
          </li>
          <li>
            MindChain ne stocke aucune information permettant d&apos;accéder, reproduire ou analyser le processus créatif d&apos;un
            utilisateur. Seules les données strictement nécessaires à la certification sont traitées, conformément à
            notre Politique de Confidentialité.
          </li>
          <li>
            MindChain n&apos;analyse, ne modère et ne contrôle pas le contenu des œuvres certifiées. L&apos;utilisateur reste seul
            responsable de la nature, de la légalité et de la liceité de ses créations.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['4._'] before:mr-2">Propriété intellectuelle</h2>

        <h3 className="before:content-['4.1._'] before:mr-2">Droits sur le service MindChain</h3>
        <p>
          Le site web MindChain, son identité visuelle, ses éléments rédactionnels, sa structure, ses modèles, sa logique
          conceptuelle, son code source, ainsi que l&apos;ensemble des éléments relevant du service MindChain sont protégés par
          le droit de la propriété intellectuelle (droit d&apos;auteur, droit des marques, droit des bases de données).
        </p>
        <p>
          Toute reproduction, représentation, diffusion, extraction, réutilisation ou adaptation, totale ou partielle, du
          site ou de l&apos;un de ses éléments, sans autorisation écrite préalable de MindChain, est strictement interdite et
          constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété
          intellectuelle.
        </p>

        <h3 className="before:content-['4.2._'] before:mr-2">Droits sur les œuvres certifiées</h3>
        <p>MindChain ne revendique aucun droit sur les créations certifiées par les utilisateurs.</p>
        <p>
          L&apos;utilisateur conserve l&apos;intégralité de ses droits de propriété intellectuelle sur ses œuvres. La certification
          d&apos;une œuvre via MindChain ne constitue en aucun cas une cession, un transfert ou une licence de droits au
          profit de MindChain.
        </p>
        <p>
          MindChain intervient exclusivement en qualité de tiers de confiance technique pour établir une preuve
          horodatée, sans acquérir aucun droit d&apos;exploitation, de reproduction ou de représentation sur les œuvres
          certifiées.
        </p>

        <h3 className="before:content-['4.3._'] before:mr-2">Responsabilité de l&apos;utilisateur</h3>
        <p>
          L&apos;utilisateur garantit être titulaire des droits nécessaires sur les œuvres qu&apos;il certifie, ou avoir obtenu
          toutes les autorisations requises. Il s&apos;engage à ne pas utiliser le service MindChain pour certifier des œuvres :
        </p>
        <ul>
          <li>Contrefaçantes ou portant atteinte aux droits de propriété intellectuelle de tiers</li>
          <li>Illégales, diffamatoires, injurieuses ou contraires à l&apos;ordre public</li>
          <li>Portant atteinte à la vie privée, à l&apos;image ou à la dignité des personnes</li>
        </ul>
      </section>

      <section>
        <h2 className="before:content-['5._'] before:mr-2">Responsabilité et limites</h2>

        <h3 className="before:content-['5.1._'] before:mr-2">Limites de responsabilité</h3>
        <p><strong>MindChain ne peut être tenu responsable :</strong></p>

        <h3 className="before:content-['5.1.1._'] before:mr-2">Concernant l&apos;utilisateur et ses œuvres</h3>
        <ul>
          <li>De l&apos;exactitude, de la complétude ou de la véracité des informations communiquées par l&apos;utilisateur</li>
          <li>De l&apos;usage, de la nature, de la qualité ou de la légalité des œuvres que l&apos;utilisateur choisit de certifier</li>
          <li>De l&apos;originalité des œuvres certifiées ou de l&apos;absence de contrefaçon</li>
          <li>
            Des litiges entre utilisateurs ou avec des tiers concernant la titularité des droits sur les œuvres certifiées
          </li>
        </ul>

        <h3 className="before:content-['5.1.2._'] before:mr-2">Concernant les technologies externes</h3>
        <ul>
          <li>
            Des conséquences techniques, économiques ou juridiques liées à l&apos;utilisation de solutions ou outils externes
            (wallets blockchain, applications tierces, plateformes externes, navigateurs)
          </li>
          <li>
            Du fonctionnement, de la sécurité ou de la disponibilité des protocoles blockchain sous-jacents (Ethereum,
            Polygon, etc.)
          </li>
          <li>De la perte ou du vol des clés privées, identifiants ou mots de passe de l&apos;utilisateur</li>
          <li>Des frais de transaction (gas fees) appliqués par les réseaux blockchain</li>
        </ul>

        <h3 className="before:content-['5.1.3._'] before:mr-2">Concernant la disponibilité du service</h3>
        <ul>
          <li>
            Des interruptions, suspensions ou dysfonctionnements potentiels liés à l&apos;infrastructure, au réseau, aux
            technologies utilisées ou aux opérations de maintenance
          </li>
          <li>
            Des attaques informatiques, virus ou intrusions affectées les systèmes malgré les mesures de sécurité mises en
            place
          </li>
          <li>
            De l&apos;indisponibilité temporaire ou définitive des services tiers dont dépend le fonctionnement de MindChain
          </li>
        </ul>

        <h3 className="before:content-['5.2._'] before:mr-2">Absence de modération</h3>
        <p>
          MindChain ne modère pas les créations de l&apos;utilisateur, n&apos;y accède pas et n&apos;est pas en mesure de les analyser.
          MindChain ne peut donc pas vérifier la conformité, la légalité ou l&apos;originalité des œuvres certifiées.
        </p>

        <h3 className="before:content-['5.3._'] before:mr-2">Valeur juridique de la certification</h3>
        <p>
          La certification blockchain fournie par MindChain constitue une preuve technique d&apos;horodatage attestant de
          l&apos;existence d&apos;une empreinte numérique à un instant donné.
        </p>
        <p>
          Cette preuve peut être utilisée dans le cadre de procédures juridiques, mais sa valeur probante sera appréciée
          souverainement par les juridictions compétentes. MindChain ne garantit pas que cette preuve sera systématiquement
          admise ou suffisante dans tous les contextes juridiques.
        </p>
        <p>La certification ne constitue pas en elle-même une preuve de titularité des droits sur l&apos;œuvre certifiée.</p>

        <h3 className="before:content-['5.4._'] before:mr-2">Obligation de moyens</h3>
        <p>
          MindChain s&apos;engage à mettre en œuvre tous les moyens raisonnables pour assurer la disponibilité, la sécurité et
          la fiabilité du service, mais ne saurait être tenu d&apos;une obligation de résultat.
        </p>
      </section>

      <section>
        <h2 className="before:content-['6._'] before:mr-2">Données personnelles et confidentialité</h2>
        <p>Voir l’exhaustivité des informations dans notre Politique de Confidentialité accessible sur le site.</p>

        <p>
          MindChain adopte une politique de minimisation stricte conformément à l&apos;article 5.1.c du Règlement Général sur
          la Protection des Données (RGPD) : seules les données strictement indispensables à l&apos;accès au service, à
          l&apos;authentification de l&apos;utilisateur et à l&apos;affichage des certifications sont collectées et conservées.
        </p>

        <p>MindChain ne conserve aucune donnée permettant de :</p>
        <ul>
          <li>Reconstituer une œuvre</li>
          <li>Comprendre ou analyser son processus de création</li>
          <li>Exploiter, reproduire ou accéder à son contenu créatif</li>
          <li>Identifier la nature ou le sujet de la création</li>
        </ul>

        <p>MindChain ne transmet aucune donnée personnelle à des tiers à des fins commerciales, publicitaires ou marketing.</p>

        <p>Les données peuvent être transmises uniquement :</p>
        <ul>
          <li>
            Aux prestataires techniques strictement nécessaires au fonctionnement du service (hébergement, infrastructure),
            liés par des obligations de confidentialité
          </li>
          <li>En cas d&apos;obligation légale ou de réquisition judiciaire valable</li>
        </ul>

        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
          d&apos;opposition et de portabilité concernant vos données personnelles.
        </p>

        <p>
          Vous disposez du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et
          des Libertés) :
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
        </p>

        <p>
          Conformément à l&apos;article 37 du RGPD, vous pouvez contacter notre Délégué à la Protection des Données à :
          <a href="mailto:dpo@mindchain">dpo@mindchain</a>
        </p>
      </section>

      <section>
        <h2 className="before:content-['7._'] before:mr-2">Journaux légaux (Logs)</h2>
        <p>
          Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN) et au décret
          n° 2011-219 du 25 février 2011, MindChain conserve les journaux techniques (logs de connexion) nécessaires à la
          sécurité et à la conformité du service.
        </p>
        <ul>
          <li>Durée de conservation des logs : <strong>1 an maximum</strong></li>
        </ul>
        <p>
          Ces données sont conservées exclusivement pour répondre à d&apos;éventuelles réquisitions judiciaires et assurer la
          sécurité du service. Elles ne sont pas exploitées à des fins commerciales ou publicitaires.
        </p>
      </section>

      <section>
        <h2 className="before:content-['8._'] before:mr-2">Cookies</h2>
        <p>
          Le site MindChain est susceptible d&apos;utiliser des cookies pour améliorer l&apos;expérience utilisateur et assurer le
          bon fonctionnement technique du service.
        </p>
        <ul>
          <li>
            <strong>Cookies strictement nécessaires :</strong> indispensables au fonctionnement du site (authentification,
            sécurité, navigation)
          </li>
          <li><strong>Cookies de performance :</strong> permettent d&apos;analyser l&apos;utilisation du site et d&apos;améliorer ses performances (anonymisés)</li>
          <li><strong>Cookies de préférences :</strong> mémorisent vos choix (langue, paramètres d&apos;affichage)</li>
        </ul>
        <p>
          Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies ou être informé de leur dépôt.
          Toutefois, le refus de certains cookies peut limiter l&apos;accès à certaines fonctionnalités du service.
        </p>
      </section>

      <section>
        <h2 className="before:content-['9._'] before:mr-2">Liens vers des services tiers</h2>
        <p>
          Le site MindChain peut contenir des liens hypertextes vers des sites web ou services externes (explorateurs
          blockchain, wallets, documentation technique, réseaux sociaux, etc.).
        </p>
        <p>MindChain n&apos;exerce aucun contrôle sur ces sites tiers et ne saurait être tenu responsable de :</p>
        <ul>
          <li>Leur contenu, fonctionnement, disponibilité ou sécurité</li>
          <li>Leurs pratiques en matière de collecte de données personnelles</li>
          <li>Les dommages ou préjudices résultant de leur utilisation</li>
        </ul>
        <p>
          L&apos;inclusion de liens vers des sites tiers ne constitue pas une approbation ou une recommandation de leur contenu
          par MindChain. Nous vous invitons à consulter les politiques de confidentialité et les mentions légales de ces
          sites avant de les utiliser.
        </p>
      </section>

      <section>
        <h2 className="before:content-['10._'] before:mr-2">Blockchain et immuabilité</h2>

        <h3 className="before:content-['10.1._'] before:mr-2">Nature de la technologie blockchain</h3>
        <p>
          Les certifications générées par MindChain reposent sur des technologies blockchain publiques et décentralisées
          (Ethereum, Polygon, ou autres réseaux compatibles).
        </p>
        <p><strong>Caractéristiques importantes :</strong></p>
        <ul>
          <li>Les transactions enregistrées sur une blockchain publique sont immuables et permanentes</li>
          <li>Les données inscrites sur la blockchain (hash, horodatage) ne peuvent être modifiées ou supprimées</li>
          <li>Les transactions sont publiquement consultables par toute personne disposant d&apos;un explorateur blockchain</li>
        </ul>

        <h3 className="before:content-['10.2._'] before:mr-2">Limites du droit à l&apos;effacement</h3>
        <p>
          En raison de l&apos;immuabilité de la blockchain, MindChain ne peut pas supprimer les données enregistrées directement
          sur la blockchain (empreintes cryptographiques, horodatage). Le droit à l&apos;effacement prévu par le RGPD
          s&apos;applique uniquement aux données personnelles stockées hors chaîne (off-chain) dans les systèmes de MindChain.
        </p>
        <p>
          En utilisant le service, vous reconnaissez et acceptez cette caractéristique intrinsèque de la technologie
          blockchain.
        </p>

        <h3 className="before:content-['10.3._'] before:mr-2">Données on-chain vs off-chain</h3>
        <p><strong>Données on-chain (sur la blockchain) :</strong></p>
        <ul>
          <li>Hash cryptographique de l&apos;œuvre (empreinte non réversible)</li>
          <li>Horodatage de la certification</li>
          <li>Adresse de wallet publique (si applicable)</li>
        </ul>
        <p>Ces données sont permanentes et publiquement consultables.</p>

        <p><strong>Données off-chain (dans nos systèmes) :</strong></p>
        <ul>
          <li>Identifiants utilisateur (pseudonymisés)</li>
          <li>Titre du certificat</li>
          <li>Métadonnées administratives</li>
        </ul>
        <p>Ces données peuvent être supprimées sur demande.</p>
      </section>

      <section>
        <h2 className="before:content-['11._'] before:mr-2">Modifications des mentions légales</h2>
        <p>
          Les présentes mentions légales peuvent être modifiées à tout moment par MindChain, notamment pour prendre en
          compte des évolutions légales, réglementaires, jurisprudentielles ou techniques.
        </p>
        <p>
          La version en vigueur est celle publiée sur le site à la date de votre consultation. La date de dernière mise à
          jour est indiquée en haut de ce document.
        </p>
        <p>
          Nous vous recommandons de consulter régulièrement cette page pour prendre connaissance des éventuelles
          modifications. L&apos;utilisation continue du service après modification des mentions légales vaut acceptation des
          nouvelles conditions.
        </p>
      </section>

      <section>
        <h2 className="before:content-['12._'] before:mr-2">Droit applicable et juridiction compétente</h2>

        <h3 className="before:content-['12.1._'] before:mr-2">Droit applicable</h3>
        <p>Les présentes mentions légales sont régies par le droit français.</p>
        <p>Elles sont conformément notamment :</p>
        <ul>
          <li>Au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD)</li>
          <li>À la loi n° 78-17 du 6 janvier 1978 relative à l&apos;informatique, aux fichiers et aux libertés (Loi Informatique et Libertés)</li>
          <li>À la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN)</li>
          <li>Au Code de la propriété intellectuelle</li>
          <li>Au Code civil</li>
        </ul>

        <h3 className="before:content-['12.2._'] before:mr-2">Juridiction compétente</h3>
        <p>
          En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes mentions légales, et à défaut de
          règlement amiable, le litige sera porté devant les tribunaux compétents conformément aux règles de procédure
          civile françaises.
        </p>
        <p>
          Pour les consommateurs : conformément aux dispositions du Code de la consommation, les litiges peuvent
          également faire l&apos;objet d&apos;une médiation. Vous pouvez recourir gratuitement au service de médiation de la
          consommation : plateforme de règlement en ligne des litiges.
        </p>

        <h3 className="before:content-['12.3._'] before:mr-2">Médiation</h3>
        <p>
          Conformément à l&apos;article L.612-1 du Code de la consommation, il est précisé que MindChain propose aux
          consommateurs, en cas de litige, la saisine d&apos;un médiateur de la consommation, dans les conditions prévues au
          titre Ier du livre VI du Code de la consommation.
        </p>
      </section>

      <section>
        <h2 className="before:content-['13._'] before:mr-2">Contact</h2>
        <p>Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :</p>
        <ul>
          <li>Par email : <a href="mailto:contact@mindchain.com">contact@mindchain.com</a></li>
          <li>Par courrier : <strong>MindChain - 8 rue du Bonheur, 75001 Paris</strong></li>
        </ul>
      </section>
    </div>
    ); 
}
export default MentionsPage;