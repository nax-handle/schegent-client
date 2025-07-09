"use client";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import {
  ProfileSection,
  PasswordSection,
  SecuritySection,
} from "@/components/settings";

export default function Component() {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, security preferences, and language
          options.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["profile", "password", "security", "language"]}
        className="space-y-4"
      >
        <ProfileSection />
        <PasswordSection />
        <SecuritySection />
        {/* // <LanguageSection /> */}
      </Accordion>

      {/* Save All Changes */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <Button size="lg" className="sm:w-auto">
          Save All Changes
        </Button>
        <Button variant="outline" size="lg" className="sm:w-auto">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
