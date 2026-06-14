import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  country: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  zipCode: z.string().min(3),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;