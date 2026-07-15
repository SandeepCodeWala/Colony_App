import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import baseURL from '../services/network/base_url';

const T = PremiumTheme;

export const getInitial = name => {
  const cleanName = String(name || '').trim();
  return cleanName ? cleanName.charAt(0).toUpperCase() : 'M';
};

export const resolveProfilePictureUri = profilePicture => {
  const rawValue =
    typeof profilePicture === 'string'
      ? profilePicture
      : profilePicture?.uri ||
        profilePicture?.url ||
        profilePicture?.path ||
        '';

  const cleanValue = String(rawValue || '').trim();
  if (!cleanValue || cleanValue === 'null' || cleanValue === 'undefined') {
    return null;
  }

  if (/^(https?:\/\/|file:\/\/|content:\/\/|data:|ph:\/\/)/i.test(cleanValue)) {
    return cleanValue;
  }

  const root = String(baseURL.base_url1 || '').replace(/\/+$/, '');
  const path = cleanValue.replace(/^\/+/, '');
  return root && path ? `${root}/${path}` : cleanValue;
};

export default function ProfileAvatar({
  name,
  profilePicture,
  size = 72,
  showEditBadge = false,
  style,
}) {
  const uri = resolveProfilePictureUri(profilePicture);
  const [imageFailed, setImageFailed] = useState(false);
  const borderRadius = size / 2;

  useEffect(() => {
    setImageFailed(false);
  }, [uri]);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius,
        },
        style,
      ]}
    >
      {uri && !imageFailed ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius }}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Text style={[styles.initial, { fontSize: Math.max(24, size * 0.42) }]}>
          {getInitial(name)}
        </Text>
      )}

      {showEditBadge ? (
        <View style={styles.editBadge}>
          <Ionicons name="camera-outline" size={15} color={T.surface} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.champagne,
    overflow: 'visible',
  },
  initial: {
    color: T.primaryDark,
    fontFamily: Fonts.displaySerif,
    lineHeight: undefined,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.primary,
    borderWidth: 3,
    borderColor: T.surface,
  },
});
