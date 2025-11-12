export interface UserToken {
  access_token: string;
  user: {
    id: number;
    fullName: string;
    username: string;
    email: string;
    createdAt: string;
  };
}