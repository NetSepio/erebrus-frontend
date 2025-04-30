"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Camera, User, MapPin, Mail, MessageSquare, AtSign, Globe, Apple, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    country: "United States",
    email: "john@example.com",
    discord: "johndoe#1234",
    twitter: "@johndoe",
    telegram: "@johndoe",
    farcaster: "@johndoe",
    google: "john.doe@gmail.com",
    apple: "john.doe@icloud.com",
  })
  
  const [tempProfileData, setTempProfileData] = useState({...profileData})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setProfileData({...tempProfileData})
    setIsEditDialogOpen(false)
  }
  
  const openEditDialog = () => {
    setTempProfileData({...profileData})
    setIsEditDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Profile Information
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 px-3 py-1">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-400"></span>
                Solana
              </Badge>
              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 font-mono">
                cK5i...W1XD
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image Section */}
            <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative mb-6 mt-4 group cursor-pointer">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-800/80 to-purple-800/80 border-4 border-gray-700 flex items-center justify-center">
                    {profileData.name ? (
                      <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-white">
                        {profileData.name.charAt(0)}
                      </div>
                    ) : (
                      <User size={64} className="text-gray-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-1">{profileData.name || "Your Name"}</h2>
                <p className="text-gray-400 text-sm mb-6 flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {profileData.country || "Your Location"}
                </p>

                <div className="w-full">
                  <Button
                    onClick={openEditDialog}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all duration-300"
                  >
                    <Edit size={16} className="mr-2" /> Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details Section */}
            <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl md:col-span-2">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-6 text-blue-400">Account Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-1">
                      <Label className="text-gray-400 text-sm">Name</Label>
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-blue-400" />
                        <p className="text-white">{profileData.name || "Not set"}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-gray-400 text-sm">Country</Label>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-blue-400" />
                        <p className="text-white">{profileData.country || "Not set"}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-gray-400 text-sm">Email</Label>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2 text-blue-400" />
                        <p className="text-white">{profileData.email || "Not set"}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-gray-400 text-sm">Discord</Label>
                      <div className="flex items-center">
                        <MessageSquare size={16} className="mr-2 text-blue-400" />
                        <p className="text-white">{profileData.discord || "Not set"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Social Accounts</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="space-y-1">
                        <Label className="text-gray-400 text-sm">Twitter</Label>
                        <div className="flex items-center">
                          <AtSign size={16} className="mr-2 text-blue-400" />
                          <p className="text-white">{profileData.twitter || "Not set"}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-gray-400 text-sm">Telegram</Label>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-400"
                          >
                            <path d="m22 3-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 3"></path>
                            <path d="M2 3v18h20V3"></path>
                            <path d="M12 11v5"></path>
                            <path d="m10 13 2 2 2-2"></path>
                          </svg>
                          <p className="text-white">{profileData.telegram || "Not set"}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-gray-400 text-sm">Farcaster</Label>
                        <div className="flex items-center">
                          <Globe size={16} className="mr-2 text-blue-400" />
                          <p className="text-white">{profileData.farcaster || "Not set"}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-gray-400 text-sm">Google</Label>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-400"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v8"></path>
                            <path d="M8 12h8"></path>
                          </svg>
                          <p className="text-white">{profileData.google || "Not set"}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-gray-400 text-sm">Apple</Label>
                        <div className="flex items-center">
                          <Apple size={16} className="mr-2 text-blue-400" />
                          <p className="text-white">{profileData.apple || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your profile information below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="flex items-center text-gray-300">
                  <User size={16} className="mr-2 text-blue-400" /> Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={tempProfileData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="country" className="flex items-center text-gray-300">
                  <MapPin size={16} className="mr-2 text-blue-400" /> Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={tempProfileData.country}
                  onChange={handleChange}
                  placeholder="Your country"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="flex items-center text-gray-300">
                  <Mail size={16} className="mr-2 text-blue-400" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={tempProfileData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="discord" className="flex items-center text-gray-300">
                  <MessageSquare size={16} className="mr-2 text-blue-400" /> Discord
                </Label>
                <Input
                  id="discord"
                  name="discord"
                  value={tempProfileData.discord}
                  onChange={handleChange}
                  placeholder="Your Discord username"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="twitter" className="flex items-center text-gray-300">
                  <AtSign size={16} className="mr-2 text-blue-400" /> Twitter
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={tempProfileData.twitter}
                  onChange={handleChange}
                  placeholder="Your Twitter handle"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="telegram" className="flex items-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 text-blue-400"
                  >
                    <path d="m22 3-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 3"></path>
                    <path d="M2 3v18h20V3"></path>
                    <path d="M12 11v5"></path>
                    <path d="m10 13 2 2 2-2"></path>
                  </svg>
                  Telegram
                </Label>
                <Input
                  id="telegram"
                  name="telegram"
                  value={tempProfileData.telegram}
                  onChange={handleChange}
                  placeholder="Your Telegram username"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="farcaster" className="flex items-center text-gray-300">
                  <Globe size={16} className="mr-2 text-blue-400" /> Farcaster
                </Label>
                <Input
                  id="farcaster"
                  name="farcaster"
                  value={tempProfileData.farcaster}
                  onChange={handleChange}
                  placeholder="Your Farcaster handle"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="google" className="flex items-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 text-blue-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                  Google
                </Label>
                <Input
                  id="google"
                  name="google"
                  value={tempProfileData.google}
                  onChange={handleChange}
                  placeholder="Your Google account"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Apple Account */}
          <div className="mt-2">
            <Label htmlFor="apple" className="flex items-center text-gray-300">
              <Apple size={16} className="mr-2 text-blue-400" /> Apple
            </Label>
            <Input
              id="apple"
              name="apple"
              value={tempProfileData.apple}
              onChange={handleChange}
              placeholder="Your Apple ID"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <X size={16} className="mr-2" /> Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}