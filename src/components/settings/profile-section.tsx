"use client";

import type React from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Camera, MapPin, Calendar, LinkIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function ProfileSection() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileVisibility, setProfileVisibility] = useState("private");

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AccordionItem value="profile" className="border rounded-lg px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Profile</div>
            <div className="text-sm text-muted-foreground font-normal">
              Manage your personal information and profile settings
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <Image
                  width={80}
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-3 w-3" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="space-y-1">
            <Label>Profile Picture</Label>
            <p className="text-sm text-muted-foreground">
              Upload a profile picture. Recommended size: 400x400px
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                Upload New
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAvatarPreview(null)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              placeholder="Enter your first name"
              defaultValue="Nguyen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              placeholder="Enter your last name"
              defaultValue="Thanh"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            defaultValue="nguyenthanh"
          />
          <p className="text-sm text-muted-foreground">
            This is your public username. It can only contain letters, numbers,
            and underscores.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-profile">Email Address</Label>
          <Input
            id="email-profile"
            type="email"
            placeholder="Enter your email"
            defaultValue="thanh@gmail.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us about yourself..."
            defaultValue="Software developer passionate about creating amazing user experiences."
          />
          <p className="text-sm text-muted-foreground">
            Brief description for your profile. Maximum 160 characters.
          </p>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Contact Information</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+84 555 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City, Country"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="birthday" type="date" className="pl-10" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Social Links */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Social Links</Label>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/username"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  placeholder="https://github.com/username"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy Settings */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Privacy Settings</Label>
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              value={profileVisibility}
              onValueChange={setProfileVisibility}
            >
              <SelectTrigger id="profile-visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  Public - Anyone can see your profile
                </SelectItem>
                <SelectItem value="private">
                  Private - Only you can see your profile
                </SelectItem>
                <SelectItem value="friends">
                  Friends Only - Only your connections can see
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-email">Show Email Publicly</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your email address on your profile.
              </p>
            </div>
            <Switch id="show-email" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show-location">Show Location</Label>
              <p className="text-sm text-muted-foreground">
                Display your location on your public profile.
              </p>
            </div>
            <Switch id="show-location" defaultChecked />
          </div>
        </div>

        <Button className="w-full sm:w-auto">Save Profile Changes</Button>
      </AccordionContent>
    </AccordionItem>
  );
}
