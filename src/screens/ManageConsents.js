import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { CravPage, Hero, EmptyState } from '../components/CravPremium';

const Screen = () => {
  const navigation = useNavigation();
  return (
    <CravPage title="MANAGE CONSENTS" onBack={() => navigation.goBack()}>
      <Hero kicker="CRAV ACCOUNT" title="Manage consents" subtitle="Control the communication permissions and preferences linked with your account." />
      <EmptyState title="Manage consents" subtitle="Content is kept same from your original app, design only is upgraded." />
    </CravPage>
  );
};

export default Screen;
