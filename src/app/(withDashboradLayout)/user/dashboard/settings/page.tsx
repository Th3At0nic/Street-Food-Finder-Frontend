// app/admin/settings/page.tsx
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Save, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          System Settings
        </h2>
        <p className="text-sm text-gray-500">Configure platform-wide settings</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Require Post Approval</h3>
                <p className="text-sm text-gray-500">All posts must be approved by moderators</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-delete Reported Posts</h3>
                <p className="text-sm text-gray-500">Automatically remove posts with 5+ reports</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Admin Alerts</h3>
                <p className="text-sm text-gray-500">Receive email notifications for critical events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div>
              <label htmlFor="notification-email" className="block text-sm font-medium text-gray-700">
                Notification Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="notification-email"
                  className="pl-10"
                  defaultValue="admin@streetfoodfinder.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="text-red-600">
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export All Data</h3>
                <p className="text-sm text-red-500">Download complete database backup</p>
              </div>
              <Button variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reset System</h3>
                <p className="text-sm text-red-500">Wipe all data and restore to defaults</p>
              </div>
              <Button variant="destructive" disabled>
                <AlertCircle className="h-4 w-4 mr-2" />
                Reset System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}