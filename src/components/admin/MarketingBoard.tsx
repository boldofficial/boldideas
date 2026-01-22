'use client';

import { useState, useTransition } from 'react';
import {
    Mail, Send, Layers, Zap, BarChart3, Plus, Trash2,
    Clock, ExternalLink, ChevronRight, MoreVertical, Users, Eye, MousePointer
} from 'lucide-react';
import { createCampaign, deleteCampaign, createSequence, createAutomation, sendCampaign } from '@/actions/marketing';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Props {
    campaigns: any[];
    sequences: any[];
    automations: any[];
}

export default function MarketingBoard({ campaigns, sequences, automations }: Props) {
    const [isAddingCampaign, setIsAddingCampaign] = useState(false);
    const [isAddingSequence, setIsAddingSequence] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const stats = {
        totalSent: campaigns.filter(c => c.status === 'sent').length,
        avgOpenRate: 24.8,
        activeSequences: sequences.filter(s => s.status === 'active').length,
        totalAutomations: automations.length
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Sent</CardTitle>
                        <Send className="h-4 w-4 text-brand-navy/60" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-brand-navy">{stats.totalSent}</div>
                        <p className="text-xs text-slate-400 mt-1">Campaigns delivered</p>
                    </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Avg Open Rate</CardTitle>
                        <Eye className="h-4 w-4 text-brand-navy/60" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-brand-navy">{stats.avgOpenRate}%</div>
                        <Progress value={stats.avgOpenRate} className="mt-2 h-1 bg-slate-100" indicatorClassName="bg-brand-navy" />
                    </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Sequences</CardTitle>
                        <Layers className="h-4 w-4 text-brand-navy/60" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-brand-navy">{stats.activeSequences}</div>
                        <p className="text-xs text-slate-400 mt-1">Drip campaigns running</p>
                    </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Automations</CardTitle>
                        <Zap className="h-4 w-4 text-brand-navy/60" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-brand-navy">{stats.totalAutomations}</div>
                        <p className="text-xs text-slate-400 mt-1">Triggers configured</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs Content */}
            <Tabs defaultValue="campaigns" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent p-0 border-b border-slate-200 w-full justify-start h-auto rounded-none space-x-6">
                        <TabsTrigger 
                            value="campaigns" 
                            className="gap-2 rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-brand-navy data-[state=active]:bg-transparent data-[state=active]:text-brand-navy data-[state=active]:shadow-none text-slate-500 hover:text-brand-navy transition-colors"
                        >
                            <Mail className="h-4 w-4" /> Campaigns
                        </TabsTrigger>
                        <TabsTrigger 
                            value="sequences" 
                            className="gap-2 rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-brand-navy data-[state=active]:bg-transparent data-[state=active]:text-brand-navy data-[state=active]:shadow-none text-slate-500 hover:text-brand-navy transition-colors"
                        >
                            <Layers className="h-4 w-4" /> Sequences
                        </TabsTrigger>
                        <TabsTrigger 
                            value="automations" 
                            className="gap-2 rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-brand-navy data-[state=active]:bg-transparent data-[state=active]:text-brand-navy data-[state=active]:shadow-none text-slate-500 hover:text-brand-navy transition-colors"
                        >
                            <Zap className="h-4 w-4" /> Automations
                        </TabsTrigger>
                        <TabsTrigger 
                            value="analytics" 
                            className="gap-2 rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-brand-navy data-[state=active]:bg-transparent data-[state=active]:text-brand-navy data-[state=active]:shadow-none text-slate-500 hover:text-brand-navy transition-colors"
                        >
                            <BarChart3 className="h-4 w-4" /> Analytics
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-brand-navy">Email Campaigns</h2>
                            <p className="text-sm text-slate-500">Manage and track your email campaigns</p>
                        </div>
                        <Button onClick={() => setIsAddingCampaign(true)} className="bg-brand-navy hover:bg-brand-navy/90">
                            <Plus className="h-4 w-4 mr-2" /> New Campaign
                        </Button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {campaigns.length === 0 ? (
                                <Card className="p-12 text-center">
                                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2">No campaigns yet</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Create your first email campaign to get started</p>
                                    <Button onClick={() => setIsAddingCampaign(true)}>
                                        <Plus className="h-4 w-4 mr-2" /> Create Campaign
                                    </Button>
                                </Card>
                            ) : (
                                campaigns.map((camp) => (
                                    <Card key={camp.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={
                                                            camp.status === 'sent' ? 'default' :
                                                            camp.status === 'scheduled' ? 'secondary' : 'outline'
                                                        }>
                                                            {camp.status}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            #{camp.id.split('-')[0]}
                                                        </span>
                                                    </div>
                                                    <CardTitle className="text-lg">{camp.subject}</CardTitle>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => {
                                                        if (confirm('Delete this campaign?')) {
                                                            startTransition(async () => {
                                                                await deleteCampaign(camp.id);
                                                                router.refresh();
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-4 gap-4 py-4 border-y">
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Recipients</p>
                                                    <p className="font-bold">{camp.recipientCount || 0}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 mb-1">Opens</p>
                                                    <p className="font-bold text-brand-navy">{camp.openCount || 0}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-400 mb-1">Clicks</p>
                                                    <p className="font-bold text-brand-navy">{camp.clickCount || 0}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">Audience</p>
                                                    <p className="font-bold text-xs uppercase">{camp.audience || 'ALL'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {camp.sentAt ? new Date(camp.sentAt).toLocaleString() : 'Pending'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {camp.status !== 'sent' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
                                                            disabled={isPending}
                                                            onClick={() => {
                                                                if (confirm('Send this campaign now to all recipients?')) {
                                                                    startTransition(async () => {
                                                                        const result = await sendCampaign(camp.id);
                                                                        if (result.success) {
                                                                            alert(result.message);
                                                                        } else {
                                                                            alert('Error: ' + result.error);
                                                                        }
                                                                        router.refresh();
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <Send className="h-3 w-3 mr-1" /> Send Now
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="text-brand-navy p-0"
                                                        onClick={() => setPreviewContent(camp.content)}
                                                    >
                                                        View Content <ExternalLink className="h-3 w-3 ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Sidebar Metrics */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Email Health</CardTitle>
                                    <CardDescription>Platform performance metrics</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-500">Deliverability</span>
                                            <span className="font-semibold text-brand-navy">99.2%</span>
                                        </div>
                                        <Progress value={99.2} className="h-1.5 bg-slate-100" indicatorClassName="bg-brand-navy" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-500">Engagement</span>
                                            <span className="font-semibold text-brand-navy">High</span>
                                        </div>
                                        <Progress value={75} className="h-1.5 bg-slate-100" indicatorClassName="bg-brand-gold" />
                                    </div>
                                    <Separator />
                                    <div className="text-xs text-slate-500">
                                        Provider: <span className="font-semibold text-brand-navy">Resend API</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsAddingCampaign(true)}>
                                        <Plus className="h-4 w-4 mr-2" /> New Campaign
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsAddingSequence(true)}>
                                        <Layers className="h-4 w-4 mr-2" /> New Sequence
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Sequences Tab */}
                <TabsContent value="sequences" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Email Sequences</h2>
                            <p className="text-sm text-muted-foreground">Automated drip campaigns</p>
                        </div>
                        <Button onClick={() => setIsAddingSequence(true)} className="bg-brand-navy hover:bg-brand-navy/90">
                            <Layers className="h-4 w-4 mr-2" /> New Sequence
                        </Button>
                    </div>

                    {sequences.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">No sequences yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Create automated email sequences for leads</p>
                            <Button onClick={() => setIsAddingSequence(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Create Sequence
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sequences.map((seq) => (
                                <Card key={seq.id} className="border-t-4 border-t-brand-gold">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base">{seq.name}</CardTitle>
                                                <Badge variant="outline" className="mt-1">{seq.status}</Badge>
                                            </div>
                                            <Layers className="h-5 w-5 text-brand-gold" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {seq.steps?.slice(0, 3).map((step: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate text-brand-navy">{step.subject}</p>
                                                        <p className="text-xs text-slate-400">+{step.delayDays}d delay</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {seq.steps?.length > 3 && (
                                                <p className="text-xs text-slate-400 text-center">
                                                    +{seq.steps.length - 3} more steps
                                                </p>
                                            )}
                                        </div>
                                        <Button variant="outline" className="w-full mt-4" size="sm">
                                            Manage Sequence
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Automations Tab */}
                <TabsContent value="automations" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Automations</h2>
                            <p className="text-sm text-muted-foreground">Trigger-based email actions</p>
                        </div>
                        <Button className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90">
                            <Zap className="h-4 w-4 mr-2" /> New Automation
                        </Button>
                    </div>

                    {automations.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">No automations yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Set up trigger-based email automations</p>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" /> Create Automation
                            </Button>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {automations.map((auto) => (
                                <Card key={auto.id}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center">
                                                <Zap className="h-5 w-5 text-brand-gold" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-brand-navy">{auto.name}</p>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Badge variant="outline" className="text-brand-navy border-slate-200">IF: {auto.triggerType}</Badge>
                                                    <ChevronRight className="h-3 w-3 text-slate-400" />
                                                    <Badge variant="outline" className="text-brand-navy border-slate-200">THEN: {auto.actionType}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Switch checked={auto.isActive} />
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <Card className="p-12 text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Analytics Coming Soon</h3>
                        <p className="text-sm text-muted-foreground">Detailed campaign analytics and insights</p>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* New Campaign Sheet */}
            <Sheet open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
                <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
                    <SheetHeader className="p-6 border-b bg-brand-navy text-white">
                        <SheetTitle className="text-white text-xl">New Campaign</SheetTitle>
                        <SheetDescription className="text-slate-300">Create a new email campaign</SheetDescription>
                    </SheetHeader>
                    <form
                        action={async (fd) => {
                            await createCampaign(fd);
                            setIsAddingCampaign(false);
                            router.refresh();
                        }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject Line</Label>
                                    <Input id="subject" name="subject" required placeholder="Enter email subject..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Audience</Label>
                                        <Select name="audience" defaultValue="all">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Contacts</SelectItem>
                                                <SelectItem value="leads">Active Leads</SelectItem>
                                                <SelectItem value="clients">Clients</SelectItem>
                                                <SelectItem value="staff">Staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="scheduledAt">Schedule</Label>
                                        <Input id="scheduledAt" name="scheduledAt" type="datetime-local" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>HTML Content</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={() => window.open('/admin/marketing/preview', '_blank')}>
                                            Preview
                                        </Button>
                                    </div>
                                    <Textarea
                                        name="content"
                                        required
                                        className="min-h-[300px] font-mono text-sm"
                                        placeholder="<html><body>Your email content...</body></html>"
                                    />
                                </div>
                            </div>
                        </ScrollArea>
                        <div className="p-6 border-t">
                            <Button type="submit" className="w-full bg-brand-navy hover:bg-brand-navy/90">
                                Save Campaign
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Content Preview Dialog */}
            <Dialog open={!!previewContent} onOpenChange={() => setPreviewContent('')}>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Email Content Preview</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh]">
                        <pre className="bg-slate-900 text-emerald-400 p-6 rounded-lg font-mono text-xs whitespace-pre-wrap">
                            {previewContent}
                        </pre>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
