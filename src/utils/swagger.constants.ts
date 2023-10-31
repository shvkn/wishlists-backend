export const SwaggerExamples = {
  Common: {
    CURRENCY: 100.11,
    DATE: '2023-10-27T05:54:49.597Z',
    ID: 10,
    IDS_LIST: [1, 2, 3],
    JWT_TOKEN:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNodmtuIiwiaWF0IjoxNjk4MzIyMzE1LCJleHAiOjE3MDM1MDYzMTV9.oCSZJ5PzVzAD9PAcoznR7PqrKZZhrPmjVWFEJD4MRwg',
    QUERY: 'username',
  },
  User: {
    ABOUT: 'Пока ничего не рассказал о себе',
    AVATAR: 'https://i.pravatar.cc/3001',
    EMAIL: 'email@site.com',
    PASSWORD: 'somestrongpassword',
    USERNAME: 'username',
  },
  Wish: {
    DESCRIPTION: 'Кроссовки HOKA ONE ONE',
    IMAGE: 'https://ir-3.ozone.ru/s3/multimedia-2/wc1000/6751428266.jpg',
    LINK: 'https://ozon.ru/t/PYJbKNJ',
    NAME: 'Кроссовки',
  },
  Wishlist: {
    IMAGE: 'https://ir-3.ozone.ru/s3/multimedia-2/wc1000/6751428266.jpg',
    NAME: 'Подарки на НГ',
  },
} as const;
export const SWAGGER_API_PATH = 'api';
export const SWAGGER_API_TITLE = 'Kupipodariday API';
export const SWAGGER_API_DESCRIPTION = 'API сервиса вишлистов';
export const SWAGGER_VERSION = '1.0';
export const SwaggerTags = {
  AUTH: 'auth',
  OFFERS: 'offers',
  USERS: 'users',
  WISHES: 'wishes',
  WISHLISTS: 'wishlists',
};
