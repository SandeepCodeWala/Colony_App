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

const TermsConditions = () => {
  const navigation = useNavigation();

  return (
    <CravPage title="Terms & Conditions" onBack={() => navigation.goBack()}>
      <Hero
        kicker="COLONY"
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using the Colony Restaurant reservation and loyalty services."
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Section title="1. Acceptance of Terms">
          By using the Colony mobile application or making a reservation, you
          agree to these Terms & Conditions. If you do not agree, please do not
          use our services.
        </Section>

        <Section title="2. Restaurant Reservations">
          Reservations are subject to table availability. Completing a booking
          request does not guarantee a reservation until confirmation has been
          received from Colony.
        </Section>

        <Section title="3. Arrival Time">
          Please arrive at your reserved time. Tables may be held for up to 15
          minutes after the booking time. Late arrivals may result in the
          reservation being cancelled or shortened.
        </Section>

        <Section title="4. Cancellation Policy">
          Reservations should be cancelled or modified as early as possible.
          Repeated failure to attend without cancelling may result in future
          booking restrictions.
        </Section>

        <Section title="5. Large Group Bookings">
          Group reservations may require additional confirmation, deposits or
          minimum spend requirements. These will be communicated during the
          booking process.
        </Section>

        <Section title="6. Loyalty Membership">
          Membership benefits, rewards and promotional offers are available only
          to registered members. Benefits are non-transferable and may not be
          exchanged for cash unless specifically stated.
        </Section>

        <Section title="7. Loyalty Points">
          Loyalty points are awarded on eligible purchases only. Points may
          expire in accordance with the membership programme rules and can only
          be redeemed when sufficient balance is available.
        </Section>

        <Section title="8. Promotional Offers">
          Promotional offers are subject to availability and individual offer
          terms. Colony reserves the right to withdraw or amend promotions
          without prior notice.
        </Section>

        <Section title="9. Payment">
          All food, beverages and services must be paid for using accepted
          payment methods. Prices include applicable taxes unless otherwise
          stated.
        </Section>

        <Section title="10. Allergies & Dietary Requirements">
          Guests should inform staff of any allergies or dietary requirements
          before placing an order. While every effort is made to prevent
          cross-contamination, we cannot guarantee an allergen-free environment.
        </Section>

        <Section title="11. Dress Code & Behaviour">
          Colony reserves the right to refuse entry or service to guests whose
          behaviour is abusive, disruptive, unsafe or inconsistent with the
          restaurant's standards.
        </Section>

        <Section title="12. Personal Information">
          Personal information collected through the application is processed in
          accordance with applicable UK data protection legislation and our
          Privacy Policy.
        </Section>

        <Section title="13. Account Security">
          You are responsible for maintaining the confidentiality of your
          account credentials and any activity occurring under your account.
        </Section>

        <Section title="14. Changes to Bookings">
          Colony reserves the right to modify or cancel reservations due to
          operational requirements, maintenance, private events or unforeseen
          circumstances.
        </Section>

        <Section title="15. Liability">
          Colony shall not be responsible for losses resulting from events
          beyond our reasonable control, including severe weather, government
          restrictions or technical failures.
        </Section>

        <Section title="16. Changes to these Terms">
          We may update these Terms & Conditions periodically. Continued use of
          the application after updates constitutes acceptance of the revised
          terms.
        </Section>

        <Section title="17. Contact Us">
          If you have any questions regarding these Terms & Conditions, please
          contact the Colony Restaurant customer support team or speak with a
          member of staff during your visit.
        </Section>
      </ScrollView>
    </CravPage>
  );
};

export default TermsConditions;

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
