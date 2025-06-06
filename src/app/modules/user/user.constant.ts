// user.constant.ts

// User roles for e-commerce platform
export enum USER_ROLE {
  CUSTOMER = 'customer',
  MODARETOR = 'modaretor', // update product 
  ADMIN = 'admin', // add product, order related issues 
  SUPER_ADMIN = 'super_admin', // Highest privilege level role change
}

// User account statuses
export enum USER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending', // For sellers awaiting approval
  BANNED = 'banned',   // For banned users
  DELETED = 'deleted', // Soft-deleted accounts
}

// Additional constants that might be useful for e-commerce
export enum ADDRESS_TYPES {
  HOME = 'home',
  OFFICE = 'office',
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export enum NOTIFICATION_PREFERENCES {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  NONE = 'none',
}

// For order status tracking (could also be in a separate order.constant.ts)
export enum ORDER_STATUS {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum Mobile_Banking_Provider {
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  ROKET = 'Rocket',
  UPAY = 'Upay',
  TAP = 'Tap',
}

export enum Payment_Type {
  CREDIT = 'credit',
  DEBIT = 'debit',
  BANK = 'bank',
  MOBILE_BANKING = 'mobile-banking',
  CASH_ON_DELIVERY = 'cash-on-delivery'
}
