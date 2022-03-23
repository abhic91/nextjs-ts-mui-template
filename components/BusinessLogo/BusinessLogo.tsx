import Image from 'next/image';

const BusinessLogo = ({ businessLogo }: { businessLogo: string }) => {
  return (
    <>
      <Image width={90} height={60} objectFit="contain" src={`/${businessLogo}`} alt="logo" />
    </>
  );
};

export default BusinessLogo;
