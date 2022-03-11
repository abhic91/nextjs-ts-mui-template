import Image from 'next/image';

const BusinessLogo = () => {
  return (
    <>
      <Image
        width={90}
        height={60}
        objectFit="contain"
        src="https://www.card91.io/wp-content/uploads/2021/02/mobileLogo.png"
        alt="logo"
      />
    </>
  );
};

export default BusinessLogo;
