import { useState } from 'react';
import { Switch, Select, Option, Label, useTheme } from '@sap-ui/fx-components';

// Settings row component - matches fx-components CSS
interface SettingsRowProps {
  label: string;
  description?: string;
  highlighted?: boolean;
  children: React.ReactNode;
}

function SettingsRow({ label, description, highlighted, children }: SettingsRowProps) {
  return (
    <div
      className={`flex items-start justify-between ${
        highlighted ? 'bg-blue-50 dark:bg-blue-950/30 rounded-lg -mx-2 px-2' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-normal text-foreground leading-normal">{label}</p>
        {description && (
          <p className="text-xs text-sapphire-text-tertiary leading-normal mt-1">{description}</p>
        )}
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  );
}

interface SettingsContentProps {
  sectionId: string;
  highlightRowIndex?: number;
  onDevModeChange?: (enabled: boolean) => void;
  devModeEnabled?: boolean;
  onLargeScreenLayoutChange?: (enabled: boolean) => void;
  largeScreenLayoutEnabled?: boolean;
}

export function SettingsContent({ sectionId, highlightRowIndex, onDevModeChange, devModeEnabled, onLargeScreenLayoutChange, largeScreenLayoutEnabled }: SettingsContentProps) {
  // Theme hook
  const { theme, setTheme } = useTheme();

  // Local state for switches and selects (demo purposes)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showSharedSpaces, setShowSharedSpaces] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [jobNotifications, setJobNotifications] = useState(true);
  const [showCompletedJobs, setShowCompletedJobs] = useState(true);
  const [personalizedRecs, setPersonalizedRecs] = useState(true);
  const [showFeatured, setShowFeatured] = useState(true);
  const [showConsoleLogs, setShowConsoleLogs] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [activityLogging, setActivityLogging] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const renderContent = () => {
    switch (sectionId) {
      case 'appearance':
        return (
          <div className="px-20 pt-10 space-y-12">
            {/* Theme selection */}
            <div className="space-y-6">
              <h2 className="text-xl font-normal text-sapphire-text-primary">Appearance</h2>
              <div className="flex items-start gap-[60px]">
                <div className="shrink-0 w-[198px]">
                  <p className="text-sm font-normal text-sapphire-text-primary leading-normal">Theme Mode</p>
                  <p className="text-xs text-sapphire-text-tertiary leading-normal mt-1">This theme applies to all your pages.</p>
                </div>
                <Select
                  className="w-[280px]"
                  value={theme}
                  onChange={({ selectedOption }) => {
                    if (selectedOption?.value) setTheme(selectedOption.value);
                  }}
                >
                  <Option value="system">Following operating system theme</Option>
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                </Select>
              </div>
            </div>
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Display</h2>
              <SettingsRow
                label="Large Screen Layout"
                description="Require wider screens (1965px+) for 3-column layout"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={largeScreenLayoutEnabled} onChange={() => onLargeScreenLayoutChange?.(!largeScreenLayoutEnabled)} />
              </SettingsRow>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Regional Preferences</h2>
              <SettingsRow
                label="Language"
                description="Select the display language"
                highlighted={highlightRowIndex === 0}
              >
                <Select className="w-40">
                  <Option selected>English</Option>
                  <Option>German</Option>
                  <Option>French</Option>
                  <Option>Spanish</Option>
                </Select>
              </SettingsRow>
              <SettingsRow
                label="Time Zone"
                description="Select your time zone"
                highlighted={highlightRowIndex === 1}
              >
                <Select className="w-40">
                  <Option selected>UTC+1 (Berlin)</Option>
                  <Option>UTC (London)</Option>
                  <Option>UTC-5 (New York)</Option>
                  <Option>UTC-8 (Los Angeles)</Option>
                </Select>
              </SettingsRow>
              <SettingsRow
                label="Date Format"
                description="Select your preferred date format"
                highlighted={highlightRowIndex === 2}
              >
                <Select className="w-40">
                  <Option selected>DD/MM/YYYY</Option>
                  <Option>MM/DD/YYYY</Option>
                  <Option>YYYY-MM-DD</Option>
                </Select>
              </SettingsRow>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Notifications</h2>
              <SettingsRow
                label="Email Notifications"
                description="Receive email notifications for important events"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
              </SettingsRow>
              <SettingsRow
                label="Push Notifications"
                description="Receive browser push notifications"
                highlighted={highlightRowIndex === 1}
              >
                <Switch checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
              </SettingsRow>
              <SettingsRow
                label="Sound"
                description="Play a sound when notifications arrive"
                highlighted={highlightRowIndex === 2}
              >
                <Switch checked={soundNotifications} onChange={() => setSoundNotifications(!soundNotifications)} />
              </SettingsRow>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Privacy & Security</h2>
              <SettingsRow
                label="Two-Factor Authentication"
                description="Require a second verification step when signing in"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
              </SettingsRow>
              <SettingsRow
                label="Activity Logging"
                description="Keep a log of your activity for auditing"
                highlighted={highlightRowIndex === 1}
              >
                <Switch checked={activityLogging} onChange={() => setActivityLogging(!activityLogging)} />
              </SettingsRow>
              <SettingsRow
                label="Session Timeout"
                description="Automatically sign out after inactivity"
                highlighted={highlightRowIndex === 2}
              >
                <Select className="w-40">
                  <Option>15 minutes</Option>
                  <Option selected>30 minutes</Option>
                  <Option>1 hour</Option>
                  <Option>Never</Option>
                </Select>
              </SettingsRow>
            </div>
          </div>
        );

      case 'conversations':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Conversations</h2>
              <SettingsRow
                label="Auto-save Conversations"
                description="Automatically save conversations as you chat"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
              </SettingsRow>
              <SettingsRow
                label="Show Timestamps"
                description="Display message timestamps in conversations"
                highlighted={highlightRowIndex === 1}
              >
                <Switch checked={showTimestamps} onChange={() => setShowTimestamps(!showTimestamps)} />
              </SettingsRow>
              <SettingsRow
                label="Default Model"
                description="Choose the AI model for new conversations"
                highlighted={highlightRowIndex === 2}
              >
                <Select className="w-40">
                  <Option selected>Joule Pro</Option>
                  <Option>Joule Standard</Option>
                  <Option>Joule Lite</Option>
                </Select>
              </SettingsRow>
            </div>
          </div>
        );

      case 'spaces':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Spaces</h2>
              <SettingsRow
                label="Default View"
                description="How to display spaces in the list"
                highlighted={highlightRowIndex === 0}
              >
                <Select className="w-40">
                  <Option selected>Cards</Option>
                  <Option>List</Option>
                  <Option>Compact</Option>
                </Select>
              </SettingsRow>
              <SettingsRow
                label="Show Shared Spaces"
                description="Include spaces shared with you by others"
                highlighted={highlightRowIndex === 1}
              >
                <Switch checked={showSharedSpaces} onChange={() => setShowSharedSpaces(!showSharedSpaces)} />
              </SettingsRow>
              <SettingsRow
                label="Auto-refresh Data"
                description="Automatically refresh space data periodically"
                highlighted={highlightRowIndex === 2}
              >
                <Switch checked={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} />
              </SettingsRow>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Jobs</h2>
              <SettingsRow
                label="Job Notifications"
                description="Get notified when jobs complete or fail"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={jobNotifications} onChange={() => setJobNotifications(!jobNotifications)} />
              </SettingsRow>
              <SettingsRow
                label="Default Sort"
                description="How to sort jobs in the list"
                highlighted={highlightRowIndex === 1}
              >
                <Select className="w-40">
                  <Option selected>Recent</Option>
                  <Option>Name</Option>
                  <Option>Status</Option>
                </Select>
              </SettingsRow>
              <SettingsRow
                label="Show Completed Jobs"
                description="Include completed jobs in the list"
                highlighted={highlightRowIndex === 2}
              >
                <Switch checked={showCompletedJobs} onChange={() => setShowCompletedJobs(!showCompletedJobs)} />
              </SettingsRow>
            </div>
          </div>
        );

      case 'discover':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Discover</h2>
              <SettingsRow
                label="Personalized Recommendations"
                description="Show content tailored to your interests"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={personalizedRecs} onChange={() => setPersonalizedRecs(!personalizedRecs)} />
              </SettingsRow>
              <SettingsRow
                label="Content Categories"
                description="Types of content to show in Discover"
                highlighted={highlightRowIndex === 1}
              >
                <Select className="w-40">
                  <Option selected>All</Option>
                  <Option>Templates</Option>
                  <Option>Tutorials</Option>
                  <Option>News</Option>
                </Select>
              </SettingsRow>
              <SettingsRow
                label="Show Featured Content"
                description="Display curated featured items"
                highlighted={highlightRowIndex === 2}
              >
                <Switch checked={showFeatured} onChange={() => setShowFeatured(!showFeatured)} />
              </SettingsRow>
            </div>
          </div>
        );

      case 'develop':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Developer</h2>
              <SettingsRow
                label="Enable Dev Mode"
                description="Shows developer-only features (e.g., the dev tab)"
                highlighted={highlightRowIndex === 0}
              >
                <Switch
                  checked={devModeEnabled}
                  onChange={() => onDevModeChange?.(!devModeEnabled)}
                />
              </SettingsRow>
              <SettingsRow
                label="Show Console Logs"
                description="Display debug logs in browser console"
                highlighted={highlightRowIndex === 1}
              >
                <Switch checked={showConsoleLogs} onChange={() => setShowConsoleLogs(!showConsoleLogs)} />
              </SettingsRow>
              <SettingsRow
                label="API Environment"
                description="Select the backend environment"
                highlighted={highlightRowIndex === 2}
              >
                <Select className="w-40">
                  <Option selected>Production</Option>
                  <Option>Staging</Option>
                  <Option>Development</Option>
                </Select>
              </SettingsRow>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="px-20 pt-10 space-y-12">
            <div className="space-y-6 max-w-[400px]">
              <h2 className="text-xl font-normal text-foreground">Accessibility</h2>
              <SettingsRow
                label="High Contrast Mode"
                description="Increase contrast for better visibility"
                highlighted={highlightRowIndex === 0}
              >
                <Switch checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
              </SettingsRow>
              <SettingsRow
                label="Screen Reader Support"
                description="Optimize for assistive technologies"
                highlighted={highlightRowIndex === 1}
              >
                <Switch checked={screenReader} onChange={() => setScreenReader(!screenReader)} />
              </SettingsRow>
              <SettingsRow
                label="Reduce Motion"
                description="Minimize animations and transitions"
                highlighted={highlightRowIndex === 2}
              >
                <Switch checked={reduceMotion} onChange={() => setReduceMotion(!reduceMotion)} />
              </SettingsRow>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-muted-foreground">
            <Label>Select a settings category from the list.</Label>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
}
