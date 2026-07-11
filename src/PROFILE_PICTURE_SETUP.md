# Profile picture setup

The Edit Profile screen now uses `react-native-image-picker` and sends the selected file with the exact multipart key `profilePicture`.

## Install

```bash
npm install react-native-image-picker
```

For iOS, run:

```bash
cd ios && pod install && cd ..
```

## iOS permission

Add this inside `ios/<YourApp>/Info.plist`:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Allow Colony to select a profile picture.</string>
```

Android's modern system photo picker normally needs no storage permission. Rebuild the app after installing the native package.

## API behavior

- Update endpoint: `PUT /user/edit_profile`
- Image field: `profilePicture`
- Other profile fields are submitted together as multipart form data when an image is selected.
- When no new image is selected, the existing JSON update request is used.
- `profilePicture: null` automatically falls back to the first letter of the member's name.
