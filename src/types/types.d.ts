declare interface IJwtPayload {
  username: string;
}

declare interface IUserRequest extends Request {
  user: {
    id: number;
    username: user.username;
    about: user.about;
    avatar: user.avatar;
    email: string;
    createdAt: user.createdAt;
    updatedAt: user.updatedAt;
  };
}
