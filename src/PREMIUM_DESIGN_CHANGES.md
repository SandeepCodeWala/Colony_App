# Colony luxury redesign

## Included

- Jumeirah-inspired full-bleed Explore and Book sections.
- Clean fixed bottom navigation for Android and iOS.
- Luxury typography system:
  - Native serif display face (`Georgia` on iOS and `serif` on Android).
  - Bundled Poppins for labels, controls and body copy.
- Existing Colony cream, gold and dark palette preserved.
- Responsive sizing through `useWindowDimensions` and platform-aware safe spacing.
- Reusable animated skeleton loader in `components/LuxurySkeleton.js`.
- Skeleton state at application boot, main tabs, shared `CravPage` screens and major stack flows.
- Redesigned sign-in, account menu, shared headers, inputs and buttons.

## Forgot-password flow

### Request OTP

`POST https://moistness-shudder-partition.ngrok-free.dev/user/forgat-password`

```json
{
  "identifier": "7355049718"
}
```

A successful response opens `OTPValidate`.

### Create new password

`POST https://moistness-shudder-partition.ngrok-free.dev/user/new-password`

```json
{
  "identifier": "7355049718",
  "otp": "595277",
  "new_password": "Ram@12345",
  "confirm_password": "Ram@12345"
}
```

A successful response resets navigation to the Login screen.

## Packages

No new npm package is required by this redesign. It uses dependencies that were already referenced by the project.
