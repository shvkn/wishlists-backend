export const ExceptionsMessages = {
  VALIDATION_ERR: 'Ошибка валидации переданных значений',
  WISHLIST_NOT_FOUND: 'Wishlist not found',
  WISH_NOT_FOUND: 'Wish not found',
  OFFER_NOT_FOUND: 'Offer not found',
  PRICE_CHANGING_NOT_ALLOWED:
    'Нельзя изменять стоимость, если уже есть желающие скинуться',
  CANT_OFFER_YOUR_WISH: 'Нельзя скидываться себе на подарок',
  YOU_SHOULD_BE_OWNER: 'Операция разрешена только владельцу',
  USER_ALREADY_EXISTS:
    'Пользователь с таким email или username уже зарегистрирован',
  USER_NOT_FOUND: 'Пользователь с таким email или username не найден',
  INCORRECT_OFFER_AMOUNT: 'Incorrect offer amount',
} as const;
