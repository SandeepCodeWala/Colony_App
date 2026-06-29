import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CravPage, Hero, PremiumCard } from '../components/CravPremium';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const Section = ({ title, children }) => (
  <PremiumCard style={styles.card}>
    <Text style={styles.heading}>{title}</Text>
    <Text style={styles.content}>{children}</Text>
  </PremiumCard>
);

const HelpSupport = () => {
  const navigation = useNavigation();

  return (
    <CravPage title="Help & Support" onBack={() => navigation.goBack()}>
      <Hero
        kicker="COLONY SUPPORT"
        title="Help & Support"
        subtitle="Find help for restaurant bookings, loyalty membership, account access and app support."
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Section title="1. Booking Support">
          If you need help with a restaurant reservation, please check your
          booking details in the app or contact our support team before your
          reservation time.
        </Section>

        <Section title="2. Changing a Reservation">
          You can request changes to your booking, including date, time or guest
          count, subject to restaurant availability.
        </Section>

        <Section title="3. Late Arrival">
          Tables may be held for up to 15 minutes after your reservation time.
          If you are running late, please contact the restaurant as soon as
          possible.
        </Section>

        <Section title="4. Cancelling a Booking">
          Please cancel your booking as early as possible if you can no longer
          attend. Repeated no-shows may affect future reservations.
        </Section>

        <Section title="5. Loyalty Account Help">
          For loyalty points, membership number, rewards or benefits, please
          check your account section or contact support with your membership
          details.
        </Section>

        <Section title="6. Points & Rewards">
          Loyalty points may take time to appear after eligible purchases. If
          your points are missing, keep your receipt and contact support.
        </Section>

        <Section title="7. Offers & Promotions">
          Offers are subject to availability and individual terms. If an offer
          is not applying correctly, please contact support before placing your
          order.
        </Section>

        <Section title="8. Account Access">
          If you cannot sign in, use the Forgot Password option or contact
          support for help verifying your account.
        </Section>

        <Section title="9. Personal Details">
          You can update allowed profile fields from the Edit Profile section.
          Some details, such as membership number or phone number, may be
          view-only for security reasons.
        </Section>

        <Section title="10. Payments">
          For payment-related issues, please contact the restaurant directly or
          speak to a member of staff during your visit.
        </Section>

        <Section title="11. Allergies & Dietary Requirements">
          Please inform restaurant staff about allergies or dietary requirements
          before ordering. The app cannot guarantee an allergen-free
          environment.
        </Section>

        <Section title="12. Technical Issues">
          If the app is not working correctly, check your internet connection,
          restart the app, and try again. If the issue continues, contact
          support.
        </Section>

        <Section title="13. Privacy & Data">
          Personal data is handled according to applicable UK data protection
          rules and the restaurant privacy policy.
        </Section>

        <Section title="14. Contact Support">
          For help, contact the Colony Restaurant support team with your name,
          membership number and booking details where applicable.
        </Section>
      </ScrollView>
    </CravPage>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },

  heading: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 18,
    color: PremiumTheme.ink,
    marginBottom: 10,
  },

  content: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: PremiumTheme.muted,
    lineHeight: 24,
  },
});
