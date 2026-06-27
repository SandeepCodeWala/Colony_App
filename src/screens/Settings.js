import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { CravPage, Hero, EmptyState } from '../components/CravPremium';

const Screen = () => {
  const navigation = useNavigation();
  return (
    <CravPage title="SETTINGS" onBack={() => navigation.goBack()}>
      <Hero
        kicker="CRAV ACCOUNT"
        title="settings"
        subtitle="App and account settings are shown in the same flow with a premium CRAV light card design."
      />
      <EmptyState
        title="settings"
        subtitle="Content is kept same from your original app, design only is upgraded."
      />
    </CravPage>
  );
};

export default Screen;
