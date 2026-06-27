import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { CravPage, Hero, EmptyState, CravButton } from '../components/CravPremium';

const RegisteredOffers = () => {
  const navigation = useNavigation();
  return (
    <CravPage title="REGISTER OFFERS" onBack={() => navigation.goBack()}>
      <Hero kicker="CRAV OFFERS" title="A place to update your details" subtitle="YOU HAVE NOT ADDED ANY OFFERS" />
      <EmptyState title="No offers added" subtitle="Be among the first to receive exclusive loyalty offers and elevate your Colony One experience ever higher." />
      <CravButton title="DISCOVER OFFERS" variant="outline" />
    </CravPage>
  );
};
export default RegisteredOffers;
