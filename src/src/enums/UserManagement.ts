export enum UserRoles {
  SuperAdmin = "super admin",
  Admin = "admin",
  Creator = "creator",
  Viewer = "viewer",
  Crypto = "crypto viewer"
}

export enum ActionTypes {
  InviteUser = "Resend Invite",
  ResetPassword = "Reset Password",
  ResetMFA = "Reset 2FA",
  RemoveUser = "Remove User"
}

export enum PusherEvents {
  ResetMFA = "mfaReset",
  UserRemoved = "userRemoved",
  RefreshPaymentQueue = "refreshPaymentQueue"
}

export enum Permissions {
  ccRead = "cc:user-read",
  ccWrite = "cc:user-write",
  efxRead = "efx:user-read",
  efxWrite = "efx:user-write",
  paymentsRead = "payments:user-read",
  paymentsWrite = "payments:user-write",
  userManagementRead = "user-management:user-read",
  userManagementWrite = "user-management:user-write",
  cryptoUserRead = "crypto:user-read",
  cryptoUserWrite = "crypto:user-write"
}
