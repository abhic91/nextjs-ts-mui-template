import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const KycForm = () => {
  const { t } = useTranslation(['form']);
  return (
    <>
      <h3>{t('hello', { ns: 'common' })}</h3>
      <h1>{t('text2')}</h1>
    </>
  );
};
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'form'])),
    },
  };
}

export default KycForm;
