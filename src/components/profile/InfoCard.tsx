import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  User,
  MapPin,
  Mail,
  MessageSquare,
  AtSign,
  Globe,
  Apple,
} from "lucide-react";

interface InfoCardProps {
  formData: {
    name: string;
    country: string;
    emailId: string;
    discord: string;
    twitter: string;
    telegram: string;
    farcaster: string;
    google: string;
    apple: string;
  };
}

export function InfoCard({ formData }: InfoCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl md:col-span-2 hover:shadow-purple-500/10 transition-all duration-300">
      <CardContent className="p-8">
        {/* Account Info */}
        <h2 className="text-xl font-semibold mb-6 text-blue-400 tracking-wide">
          Account Information
        </h2>

        <div className="space-y-6">
          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-gray-400 text-sm">
                Name
              </Label>
              <div className="flex items-center">
                <User size={16} className="mr-2 text-blue-400" />
                <p className="text-white">{formData.name || "Not set"}</p>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <Label htmlFor="country" className="text-gray-400 text-sm">
                Country
              </Label>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-blue-400" />
                <p className="text-white">{formData.country || "Not set"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="emailId" className="text-gray-400 text-sm">
                Email
              </Label>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-blue-400" />
                <p className="text-white">{formData.emailId || "Not set"}</p>
              </div>
            </div>

            {/* Discord */}
            <div className="space-y-1">
              <Label htmlFor="discord" className="text-gray-400 text-sm">
                Discord
              </Label>
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-2 text-blue-400" />
                <p className="text-white">{formData.discord || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Social Accounts */}
          <div className="pt-6 border-t border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-blue-400 tracking-wide">
              Social Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {/* Twitter */}
              <div className="space-y-1">
                <Label htmlFor="twitter" className="text-gray-400 text-sm">
                  Twitter
                </Label>
                <div className="flex items-center">
                  <AtSign size={16} className="mr-2 text-blue-400" />
                  <p className="text-white">{formData.twitter || "Not set"}</p>
                </div>
              </div>

              {/* Telegram */}
              <div className="space-y-1">
                <Label htmlFor="telegram" className="text-gray-400 text-sm">
                  Telegram
                </Label>
                <div className="flex items-center">
                  <p className="text-white">{formData.telegram || "Not set"}</p>
                </div>
              </div>

              {/* Farcaster */}
              <div className="space-y-1">
                <Label htmlFor="farcaster" className="text-gray-400 text-sm">
                  Farcaster
                </Label>
                <div className="flex items-center">
                  <Globe size={16} className="mr-2 text-blue-400" />
                  <p className="text-white">
                    {formData.farcaster || "Not set"}
                  </p>
                </div>
              </div>

              {/* Google */}
              <div className="space-y-1">
                <Label htmlFor="google" className="text-gray-400 text-sm">
                  Google
                </Label>
                <div className="flex items-center">
                  <p className="text-white">{formData.google || "Not set"}</p>
                </div>
              </div>

              {/* Apple */}
              <div className="space-y-1">
                <Label htmlFor="apple" className="text-gray-400 text-sm">
                  Apple
                </Label>
                <div className="flex items-center">
                  <Apple size={16} className="mr-2 text-blue-400" />
                  <p className="text-white">{formData.apple || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
