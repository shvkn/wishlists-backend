export const ApiPropertiesExamples = {
  User: {
    USERNAME: 'username',
    EMAIL: 'email@site.com',
    ABOUT: 'Пока ничего не рассказал о себе',
    PASSWORD: 'somestrongpassword',
    AVATAR: 'https://i.pravatar.cc/3001',
  },
  Common: {
    IDS_LIST: [1, 2, 3],
    QUERY: 'username',
    ID: 10,
    DATE: '2023-10-27T05:54:49.597Z',
    CURRENCY: 100.11,
    JWT_TOKEN:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNodmtuIiwiaWF0IjoxNjk4MzIyMzE1LCJleHAiOjE3MDM1MDYzMTV9.oCSZJ5PzVzAD9PAcoznR7PqrKZZhrPmjVWFEJD4MRwg',
  },
  Wish: {
    NAME: 'Кроссовки',
    LINK: 'https://ozon.ru/t/PYJbKNJ',
    IMAGE: 'https://ir-3.ozone.ru/s3/multimedia-2/wc1000/6751428266.jpg',
    DESCRIPTION: 'Кроссовки HOKA ONE ONE',
  },
  Wishlist: {
    NAME: 'Подарки на НГ',
    IMAGE: 'https://ir-3.ozone.ru/s3/multimedia-2/wc1000/6751428266.jpg',
  },
  Offer: {
    hidden: false,
  },
} as const;

export const ApiDefaults = {
  User: {
    ABOUT: 'Пока ничего не рассказал о себе',
    AVATAR: 'https://i.pravatar.cc/3001',
  },
} as const;
