"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShippingAddress } from "@/types/order.types";
import { useAppSelector } from "@/store/hooks";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  zipCode: z.string().min(3, "Zip code is required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingAddress) => void;
  defaultValues?: Partial<ShippingAddress>;
}

const COUNTRIES = [
  "Bangladesh", "United States", "United Kingdom", "Canada",
  "Australia", "India", "Germany", "France", "Singapore",
];

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const { user } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? user?.name ?? "",
      email: defaultValues?.email ?? user?.email ?? "",
      country: defaultValues?.country ?? "Bangladesh",
      ...defaultValues,
    },
  });

  const selectedCountry = watch("country");

  const fields = [
    {
      id: "fullName",
      label: "Full Name",
      placeholder: "John Doe",
      type: "text",
      colSpan: 1,
    },
    {
      id: "email",
      label: "Email Address",
      placeholder: "john@example.com",
      type: "email",
      colSpan: 1,
    },
    {
      id: "phone",
      label: "Phone Number",
      placeholder: "+1 234 567 8900",
      type: "tel",
      colSpan: 2,
    },
    {
      id: "address",
      label: "Street Address",
      placeholder: "123 Main St, Apartment 4B",
      type: "text",
      colSpan: 2,
    },
    {
      id: "city",
      label: "City",
      placeholder: "New York",
      type: "text",
      colSpan: 1,
    },
    {
      id: "zipCode",
      label: "ZIP / Postal Code",
      placeholder: "10001",
      type: "text",
      colSpan: 1,
    },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-primary" />
          Shipping Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((field) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  field.colSpan === 2 ? "sm:col-span-2" : ""
                }
              >
                <div className="space-y-1.5">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.id)}
                    className={
                      errors[field.id] ? "border-red-500 focus-visible:ring-red-500" : ""
                    }
                  />
                  {errors[field.id] && (
                    <p className="text-xs text-red-500">
                      {errors[field.id]?.message}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Country Select */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Country</Label>
              <Select
                value={selectedCountry}
                onValueChange={(val) => setValue("country", val)}
              >
                <SelectTrigger
                  className={errors.country ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-xs text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          <motion.div whileTap={{ scale: 0.98 }} className="mt-8">
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 font-bold rounded-xl gap-2"
            >
              Continue to Review
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}