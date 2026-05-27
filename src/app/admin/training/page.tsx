import { getTrainingRegistrations, updateRegistrationStatus, deleteRegistration } from '@/actions/training';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { revalidatePath } from 'next/cache';

export default async function TrainingAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const registrations = await getTrainingRegistrations({
    search: params.search,
    status: params.status,
    mode: params.mode,
  });

  const total = registrations?.length || 0;
  const pending = registrations?.filter(r => r.status === 'pending').length || 0;
  const contacted = registrations?.filter(r => r.status === 'contacted').length || 0;
  const enrolled = registrations?.filter(r => r.status === 'enrolled').length || 0;

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deleteRegistration(id);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Training Registrations</h1>
        <form action="" method="get" className="flex gap-2">
          <Input
            name="search"
            placeholder="Search by name or email..."
            defaultValue={params.search || ''}
            className="w-64"
          />
          <Select name="status" defaultValue={params.status || 'all'}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select name="mode" defaultValue={params.mode || 'all'}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-brand-navy text-white">Filter</Button>
        </form>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total', value: total, color: 'bg-white' },
          { label: 'Pending', value: pending, color: 'bg-yellow-50' },
          { label: 'Contacted', value: contacted, color: 'bg-blue-50' },
          { label: 'Enrolled', value: enrolled, color: 'bg-green-50' },
        ].map((card) => (
          <div key={card.label} className={`${card.color} border border-slate-200 rounded-2xl p-6`}>
            <div className="text-sm text-slate-500 mb-2">{card.label}</div>
            <div className="text-3xl font-black text-brand-navy">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <Button
          onClick={() => {
            const headers = ['#', 'Name', 'Email', 'Phone', 'Location', 'Mode', 'Level', 'Status', 'Date'];
            const rows = registrations?.map((r, idx) => [
              idx + 1,
              r.fullName,
              r.email,
              r.phone,
              r.location,
              r.mode,
              r.experienceLevel,
              r.status,
              r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
            ]) || [];
            const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bold-ideas-registrations-${Date.now()}.csv`;
            a.click();
          }}
          variant="outline"
          className="border-brand-navy text-brand-navy"
        >
          Export CSV
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold">#</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Phone</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Mode</TableHead>
              <TableHead className="font-bold">Level</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations?.map((reg, idx) => (
              <TableRow key={reg.id} className="hover:bg-slate-50">
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-semibold">{reg.fullName}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.phone}</TableCell>
                <TableCell>{reg.location}</TableCell>
                <TableCell className="capitalize">{reg.mode}</TableCell>
                <TableCell className="capitalize">{reg.experienceLevel}</TableCell>
                <TableCell>
                  <Badge className={
                    reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    reg.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    reg.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {reg.status}
                  </Badge>
                </TableCell>
                <TableCell>{reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <a
                      href={`/admin/training/${reg.id}`}
                      className="text-brand-navy hover:text-brand-gold font-semibold text-sm"
                    >
                      View
                    </a>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-500 hover:text-red-700 font-semibold text-sm">
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {reg.fullName}'s registration.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={reg.id} />
                            <AlertDialogAction
                              type="submit"
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
