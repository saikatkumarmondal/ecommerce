import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Featured", href: "/products?isFeatured=true" },
    { label: "New Arrivals", href: "/products?sortBy=newest" },
    { label: "Best Sellers", href: "/products?sortBy=best_selling" },
    { label: "On Sale", href: "/products?onSale=true" },
  ],
  account: [
    { label: "My Profile", href: "/dashboard" },
    { label: "My Orders", href: "/dashboard/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
    { label: "Settings", href: "/dashboard/settings" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Track Order", href: "/dashboard/orders" },
    { label: "Returns", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Your one-stop destination for premium products. Quality, value, and exceptional shopping experience.
            </p>

            {/* Newsletter */}
            <p className="text-sm font-semibold text-white mb-3">Stay Updated</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-10"
              />
              <Button size="sm" className="flex-shrink-0 px-4">Subscribe</Button>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@shopflow.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>New York, USA</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Shop", links: footerLinks.shop },
            { title: "Account", links: footerLinks.account },
            { title: "Support", links: footerLinks.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
                {title}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-gray-800" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            {["VISA", "MC", "AMEX", "PayPal"].map((brand) => (
              <div
                key={brand}
                className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold text-gray-400"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}