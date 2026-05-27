import { getTrainingRegistrations, updateRegistrationStatus, deleteRegistration } from '@/actions/training';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registrations = await getTrainingRegistrations();
  const registration = registrations?.find(r => r.id === id);

  if (!registration) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/training" className="text-brand-navy hover:text-brand-gold">
          ← Back to List
        </a>
        <h1 className="text-3xl font-bold text-slate-800">Registration Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Student Info */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-3xl p-8 sticky top-8">
            <h2 className="text-xl font-bold text-brand-navy mb-6">Student Information</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500">Full Name</Label>
                <p className="text-lg font-semibold text-brand-navy">{registration.fullName}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Email</Label>
                <p className="text-brand-navy">{registration.email}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Phone</Label>
                <p className="text-brand-navy">{registration.phone}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Location</Label>
                <p className="text-brand-navy">{registration.location}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Mode</Label>
                <p className="capitalize text-brand-navy">{registration.mode}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Experience Level</Label>
                <p className="capitalize text-brand-navy">{registration.experienceLevel}</p>
              </div>
              {registration.goal && (
                <div>
                  <Label className="text-xs text-slate-500">Goal</Label>
                  <p className="text-slate-600">{registration.goal}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-slate-500">Status</Label>
                <Badge className={
                  registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  registration.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                  registration.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }>
                  {registration.status}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Registered On</Label>
                <p className="text-slate-600">{registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Admin Actions */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-brand-navy mb-6">Admin Actions</h2>

            {/* Update Status Form */}
            <form
              action={async (formData: FormData) => {
                'use server';
                await updateRegistrationStatus(
                  registration.id,
                  formData.get('status') as string,
                  formData.get('adminNotes') as string
                );
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="status">Update Status</Label>
                <Select name="status" defaultValue={registration.status || 'pending'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  name="adminNotes"
                  defaultValue={registration.adminNotes || ''}
                  placeholder="Add notes about this registration..."
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy">
                Save Changes
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Registration</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {registration.fullName}'s registration.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        'use server';
                        await deleteRegistration(registration.id);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
