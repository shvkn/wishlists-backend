declare interface IJwtPayload {
  username: string;
}

declare interface IUser {
  id: number;
  username: user.username;
  about: user.about;
  avatar: user.avatar;
  email: string;
  createdAt: user.createdAt;
  updatedAt: user.updatedAt;
}

declare interface IUserRequest extends Request {
  user: IUser;
}
