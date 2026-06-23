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
import { useEffect } from "react";

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

// Motion animation presets
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

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

  // Explicitly register the country field for React Hook Form tracking
  useEffect(() => {
    register("country");
  }, [register]);

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0 py-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-card border shadow-xl backdrop-blur-sm rounded-2xl p-5 sm:p-7 lg:p-9 transition-all duration-300 hover:shadow-2xl hover:border-muted-foreground/20"
      >
        <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5 mb-8 border-b pb-4 border-muted">
          <MapPin className="w-6 h-6 text-primary animate-pulse" />
          Shipping Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
          >
            {fields.map((field) => (
              <motion.div
                key={field.id}
                variants={itemVariants}
                className={field.colSpan === 2 ? "sm:col-span-2" : ""}
              >
                <div className="space-y-2 group">
                  <Label 
                    htmlFor={field.id}
                    className="text-sm font-semibold transition-colors duration-200 group-focus-within:text-primary"
                  >
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      {...register(field.id)}
                      className={`h-11 rounded-xl transition-all duration-200 border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-offset-0 bg-background/50 backdrop-blur-xs ${
                        errors[field.id] 
                          ? "border-destructive focus-visible:ring-destructive" 
                          : "focus-visible:ring-primary focus-visible:border-primary hover:border-muted-foreground/40"
                      }`}
                    />
                  </div>
                  {errors[field.id] && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-medium text-destructive mt-1"
                    >
                      {errors[field.id]?.message}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Country Select Field */}
            <motion.div variants={itemVariants} className="sm:col-span-2 space-y-2 group">
              <Label className="text-sm font-semibold transition-colors duration-200 group-focus-within:text-primary">
                Country
              </Label>
              <Select
                value={selectedCountry}
                onValueChange={(val) => setValue("country", val, { shouldValidate: true })}
              >
                <SelectTrigger
                  className={`h-11 rounded-xl bg-background/50 backdrop-blur-xs transition-all duration-200 border-muted-foreground/20 focus:ring-2 focus:ring-offset-0 ${
                    errors.country 
                      ? "border-destructive focus:ring-destructive" 
                      : "focus:ring-primary hover:border-muted-foreground/40"
                  }`}
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-64 backdrop-blur-md">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-lg my-0.5 cursor-pointer">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-destructive mt-1"
                >
                  {errors.country.message}
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* Styled Dynamic 3D Submit Button Layer */}
          <div className="mt-10 relative group bg-primary/20 rounded-xl pt-1.5 transition-all duration-200">
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ y: 1.5 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full h-13 font-extrabold text-base rounded-xl gap-2 shadow-[0_5px_0_0] shadow-primary-foreground/15 border-b-[5px] border-primary-foreground/20 transition-all duration-100 bg-primary hover:bg-primary/95 text-primary-foreground"
              >
                Continue to Review
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}