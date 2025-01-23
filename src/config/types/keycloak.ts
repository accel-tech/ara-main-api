export type KeycloakResponse = {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  email: string;
  roles?: string[];
};
