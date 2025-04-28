"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, User, MapPin, Mail, MessageSquare, AtSign, Globe, Apple, Edit, Save, Upload } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    country: "",
    email: "",
    discord: "",
    twitter: "",
    telegram: "",
    farcaster: "",
    google: "",
    apple: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Save profile data logic would go here
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Profile Information
            </h1>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-800 px-3 py-1">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-400"></span>
                Solana
              </Badge>
              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 font-mono">
                cK5i...W1XD
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="nfts">My NFTs</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Image Section */}
                <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="relative mb-6 mt-4">
                      <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
                        {/* Replace with your actual profile image */}
                        <p className="text-sm text-center px-4">profile-image.webp</p>
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition-colors duration-200">
                          <Camera size={18} />
                        </button>
                      )}
                    </div>

                    <h2 className="text-xl font-bold mb-1">{profileData.name || "Your Name"}</h2>
                    <p className="text-gray-400 text-sm mb-4">{profileData.country || "Your Location"}</p>

                    <div className="w-full mt-4">
                      <Button
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                      >
                        {isEditing ? (
                          <>
                            <Save size={16} className="mr-2" /> Save Profile
                          </>
                        ) : (
                          <>
                            <Edit size={16} className="mr-2" /> Edit Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Form Section */}
                <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl md:col-span-2">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="flex items-center text-gray-300 mb-2">
                            <User size={16} className="mr-2 text-blue-400" /> Name
                          </Label>
                          <Input
                            id="name"
                            
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="country" className="flex items-center text-gray-300 mb-2">
                            <MapPin size={16} className="mr-2 text-blue-400" /> Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            value={profileData.country}
                            onChange={handleChange}
                            placeholder="Your country"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="flex items-center text-gray-300 mb-2">
                            <Mail size={16} className="mr-2 text-blue-400" /> Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleChange}
                            placeholder="Your email"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="discord" className="flex items-center text-gray-300 mb-2">
                            <MessageSquare size={16} className="mr-2 text-blue-400" /> Discord
                          </Label>
                          <Input
                            id="discord"
                            name="discord"
                            value={profileData.discord}
                            onChange={handleChange}
                            placeholder="Your Discord username"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Social Media */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="twitter" className="flex items-center text-gray-300 mb-2">
                            <AtSign size={16} className="mr-2 text-blue-400" /> Twitter
                          </Label>
                          <Input
                            id="twitter"
                            name="twitter"
                            value={profileData.twitter}
                            onChange={handleChange}
                            placeholder="Your Twitter handle"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="telegram" className="flex items-center text-gray-300 mb-2">
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
                            value={profileData.telegram}
                            onChange={handleChange}
                            placeholder="Your Telegram username"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="farcaster" className="flex items-center text-gray-300 mb-2">
                            <Globe size={16} className="mr-2 text-blue-400" /> Farcaster
                          </Label>
                          <Input
                            id="farcaster"
                            name="farcaster"
                            value={profileData.farcaster}
                            onChange={handleChange}
                            placeholder="Your Farcaster handle"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="google" className="flex items-center text-gray-300 mb-2">
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
                            value={profileData.google}
                            onChange={handleChange}
                            placeholder="Your Google account"
                            disabled={!isEditing}
                            className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Apple Account */}
                    <div className="mt-6">
                      <Label htmlFor="apple" className="flex items-center text-gray-300 mb-2">
                        <Apple size={16} className="mr-2 text-blue-400" /> Apple
                      </Label>
                      <Input
                        id="apple"
                        name="apple"
                        value={profileData.apple}
                        onChange={handleChange}
                        placeholder="Your Apple ID"
                        disabled={!isEditing}
                        className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      />
                    </div>

                    {/* Save Button (Mobile Only) */}
                    {isEditing && (
                      <div className="mt-6 md:hidden">
                        <Button
                          onClick={handleSave}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                        >
                          <Save size={16} className="mr-2" /> Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nfts">
              <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your NFT Collection</h2>
                    <p className="text-gray-400 mb-8">View and manage your Erebrus NFTs</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* NFT Card Example */}
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300">
                        <div className="aspect-square w-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                          <p className="text-sm text-center px-4">vpn-nft-image.webp</p>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold">Erebrus VPN Access</h3>
                          <p className="text-sm text-gray-400">Valid until: Dec 31, 2023</p>
                        </div>
                      </div>

                      {/* Empty NFT Card */}
                      <div className="bg-gray-800/20 border border-dashed border-gray-700 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 hover:bg-gray-800/30 transition-all duration-300">
                        <Upload className="h-12 w-12 text-gray-600 mb-4" />
                        <p className="text-gray-500 text-center">Mint a new NFT to add to your collection</p>
                        <Button
                          variant="outline"
                          className="mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          Go to Mint Page
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
