export default [
  {
    id: "user1",
    name: "Alice Johnson",
    email: "test1@example.com",
    password: "password",
    role: "USER",
    isTwoFactorEnabled: false,
    stripeCustomerId: "cus_123abc",
    stripeSubscriptionId: "sub_123abc",
    stripeSubscriptionEndsOn: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1),
    ),
  },
  {
    id: "user2",
    name: "Bob Smith",
    email: "test2@test.com",
    password: "password",
    role: "USER",
    isTwoFactorEnabled: true,
    stripeCustomerId: "cus_456def",
    stripeSubscriptionId: "sub_456def",
    stripeSubscriptionEndsOn: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1),
    ),
  },
] as const;
