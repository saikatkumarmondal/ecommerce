import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-12 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black">{APP_NAME}</span>
        </Link>

        {/* Center Content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-black leading-tight mb-4">
            Your Premium
            <br />
            Shopping
            <br />
            Destination
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Discover thousands of products from top brands. Fast shipping,
            easy returns, and secure payments.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Products", value: "10K+" },
              { label: "Brands", value: "200+" },
              { label: "Customers", value: "50K+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <p className="text-white/90 text-sm italic leading-relaxed mb-3">
            "ShopFlow has completely transformed my online shopping experience.
            The quality and speed are unmatched!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
              S
            </div>
            <div>
              <p className="text-sm font-semibold">Sarah Johnson</p>
              <p className="text-white/60 text-xs">Verified Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-8 lg:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black">{APP_NAME}</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}