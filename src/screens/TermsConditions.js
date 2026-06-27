import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { CravPage, Hero, EmptyState } from '../components/CravPremium';

const Screen = () => {
  const navigation = useNavigation();
  return (
    <CravPage title="TERMS & CONDITIONS" onBack={() => navigation.goBack()}>
      <Hero kicker="CRAV ACCOUNT" title="terms and condition" subtitle="Review the terms and condition connected with your membership account." />
      <EmptyState title="terms and condition" subtitle="Content is kept same from your original app, design only is upgraded." />
    </CravPage>
  );
};

export default Screen;
