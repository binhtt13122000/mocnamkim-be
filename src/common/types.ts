export interface HasuraRoles {
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
    "x-hasura-user-id": string;
  };
  sub: string;
  audience: string;
  issuer: string;
}
