import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, Edit } from "lucide-react";

interface ProfileCardProps {
  formData: {
    name: string;
    country: string;
    profilePictureUrl: string;
  };
  onEditClick: () => void;
}

export function ProfileCard({ formData, onEditClick }: ProfileCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
      <CardContent className="p-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-6 mt-4 group">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-800/80 to-purple-800/80 border-4 border-gray-700 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
            {formData.profilePictureUrl ? (
              <img
                alt="Profile"
                src={`https://ipfs.myriadflow.com/ipfs/${formData.profilePictureUrl}`}
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src =
                    "https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199001739.jpg";
                }}
              />
            ) : formData.name ? (
              <div className="flex items-center justify-center w-full h-full text-5xl font-bold text-white">
                {formData.name.charAt(0)}
              </div>
            ) : (
              <User size={64} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Name & Location */}
        <h2 className="text-2xl font-semibold mb-1 text-white">
          {formData.name || "Your Name"}
        </h2>
        <p className="text-gray-400 text-sm mb-6 flex items-center">
          <MapPin size={14} className="mr-1 text-purple-400" />
          {formData.country || "Your Location"}
        </p>

        {/* Edit Button */}
        <Button
          onClick={onEditClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium py-2 transition-all shadow-md hover:shadow-lg"
          aria-label="Edit your profile information"
        >
          <Edit size={16} className="mr-2" /> Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}
