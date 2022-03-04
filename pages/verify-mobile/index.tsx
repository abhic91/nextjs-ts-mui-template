import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const VerifyMobile: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <h1>{t('hello')}</h1>
    </>
  );
};
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export default VerifyMobile;
