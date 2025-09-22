import extractParamsAppRouter, { AppRouterProps, IParams } from '#utils/server-side-helper/app/extract-params';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import { FullTable } from '#components/table/full';
import { Metadata } from 'next';
import { formatIntFr } from '#utils/helpers';

export const generateMetadata = async (
  props: AppRouterProps
): Promise<Metadata> => {
  const { page, isBot } = await extractParamsAppRouter(props);
  const { slug: SirenReference, sirenToCompare } = await props.params as ComparaisonParams;

  const unitesLegales = await Promise.all([
    cachedGetUniteLegale(SirenReference, isBot, page),
    cachedGetUniteLegale(sirenToCompare, isBot, page),
  ]);

  return {
    title: `Comparaison d'entreprises - ${unitesLegales[0].nomComplet} vs ${unitesLegales[1].nomComplet}`,
    description: `Comparaison des numéros SIREN, adresses de siège, noms et codes d'activités des entreprises ${unitesLegales[0].nomComplet} et ${unitesLegales[1].nomComplet}, parce que, pourquoi pas.`,
    robots: 'index, follow'
  };
};

type ComparaisonParams = IParams & {
  sirenToCompare: string;
}

export default async function ComparisonPage(props: AppRouterProps) {
  const { page, isBot } = await extractParamsAppRouter(props);
  const { slug: SirenReference, sirenToCompare } = await props.params as ComparaisonParams;

  const unitesLegales = await Promise.all([
    cachedGetUniteLegale(SirenReference, isBot, page),
    cachedGetUniteLegale(sirenToCompare, isBot, page),
  ]);

  const data = [
    ["Siren", formatIntFr(unitesLegales[0].siren), formatIntFr(unitesLegales[1].siren)],
    ["Adresse", unitesLegales[0].siege.adresse, unitesLegales[1].siege.adresse],
    ["Code NAF", unitesLegales[0].siege.activitePrincipale, unitesLegales[1].siege.activitePrincipale],
  ];

  return (
    <>
      <h1>Comparaisons des entreprises {unitesLegales[0].nomComplet} et {unitesLegales[1].nomComplet}</h1>
      <FullTable
        head={["Dénomination", unitesLegales[0].nomComplet, unitesLegales[1].nomComplet]}
        body={data} />
    </>
  );
}
