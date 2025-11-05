import { View, Text, Modal } from 'react-native'
import React from 'react'

const CancelModal = () => {
  return (
    <View>
     <Modal visible={showPolicy} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.policyTitle}>Cancellation Policy</Text>
              <TouchableOpacity onPress={() => setShowPolicy(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.policySubtitle}>
              The Deposited Amount Is Non-Refundable If:
            </Text>
            <View style={{ marginTop: 8 }}>
              {[
                'The reservation is cancelled with less than 48 hours prior to the booking date',
                'A sudden reduction of the number of guests',
                'A “No Show”',
              ].map((line, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>·</Text>
                  <Text style={styles.modalBodyText}>{line}</Text>
                </View>
              ))}
            </View>
            <Button
              title="Ok"
              style={styles.modalCta}
              textStyle={styles.payText}
              onPress={() => setShowPolicy(false)}
            />
          </View>
        </View>
      </Modal>
 
    </View>
  )
}

export default CancelModal