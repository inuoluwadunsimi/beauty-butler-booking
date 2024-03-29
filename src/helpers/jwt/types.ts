export interface JwtConfig {
  privateKey: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  handleJsonResponse?: Function;
  UserTokenDb: any;
}
