import type { GetStaticProps, NextPage } from 'next';

const Home: NextPage = () => {
  return <div></div>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    redirect: { destination: '/verify-mobile' },
  };
};

export default Home;
