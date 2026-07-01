import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { CravPage, Hero, EmptyState } from '../components/CravPremium';

const Screen = () => {
  const navigation = useNavigation();
  return (
    <CravPage title="HELP & SUPPORT" onBack={() => navigation.goBack()}>
      <Hero
        kicker="CRAV ACCOUNT"
        title="Help support"
        subtitle="Need help with your account or bookings? Our support details stay same, only the presentation is cleaner."
      />
      <EmptyState
        title="Help support"
        subtitle="Content is kept same from your original app, design only is upgraded."
      />
    </CravPage>
  );
};

export default Screen;
