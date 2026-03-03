import { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  const [dataDignity, setDataDignity] = useState(true);
  const [voiceCapture, setVoiceCapture] = useState(true);
  const [knowledgeSharing, setKnowledgeSharing] = useState(true);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
          Configuration
        </p>
        <h2 className="font-heading text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      {/* Data Dignity */}
      <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
        <div className="aura-blob w-32 h-32 bg-aura-green/15 -top-8 -right-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg font-semibold">Data Dignity</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg">
            Control how your growth data is shared. You own your Growth Diary entries.
            The company owns the professional logic and institutional knowledge derived from your contributions.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                {dataDignity ? (
                  <Eye className="w-4 h-4 text-aura-green" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Data Dignity Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Show ownership boundaries on all captured knowledge
                  </p>
                </div>
              </div>
              <Switch checked={dataDignity} onCheckedChange={setDataDignity} />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium">Voice Capture</p>
                <p className="text-xs text-muted-foreground">
                  Allow voice entries in your Growth Diary
                </p>
              </div>
              <Switch checked={voiceCapture} onCheckedChange={setVoiceCapture} />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Knowledge Clone Access</p>
                <p className="text-xs text-muted-foreground">
                  Allow successors to query your institutional memory
                </p>
              </div>
              <Switch checked={knowledgeSharing} onCheckedChange={setKnowledgeSharing} />
            </div>
          </div>

          {dataDignity && (
            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-[10px] uppercase tracking-wider text-primary font-medium mb-2">
                Ownership Transparency
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">You Own</p>
                  <ul className="space-y-1">
                    <li className="text-foreground">• Personal growth reflections</li>
                    <li className="text-foreground">• Career development notes</li>
                    <li className="text-foreground">• Purpose alignment data</li>
                  </ul>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Company Owns</p>
                  <ul className="space-y-1">
                    <li className="text-foreground">• Process documentation</li>
                    <li className="text-foreground">• Decision rationale logs</li>
                    <li className="text-foreground">• Institutional knowledge graph</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
