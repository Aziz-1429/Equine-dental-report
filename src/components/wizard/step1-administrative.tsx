'use client';

import { useFormContext } from 'react-hook-form';
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DentalReportData } from '@/lib/types';

export function Step1Administrative() {
  const { register, formState: { errors } } = useFormContext<DentalReportData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Administrative Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Client contact details and exam location.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Client Details</CardTitle>
              <CardDescription>Horse owner contact information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-semibold">
              Client Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientName"
              placeholder="e.g. John Smith"
              className="h-12 text-base"
              {...register('clientName', { required: 'Client name is required' })}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">
                Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="h-12 pl-10 text-base"
                  {...register('phone')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  className="h-12 pl-10 text-base"
                  {...register('email')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Exam Location</CardTitle>
              <CardDescription>Where the examination took place</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="stableLocation" className="text-sm font-semibold">
              Stable / Farm Location
            </Label>
            <Input
              id="stableLocation"
              placeholder="e.g. Greenfield Stables, 123 Pasture Lane"
              className="h-12 text-base"
              {...register('stableLocation')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examDate" className="text-sm font-semibold">
              Date of Examination <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="examDate"
                type="date"
                className="h-12 pl-10 text-base"
                {...register('examDate', { required: 'Exam date is required' })}
              />
            </div>
            {errors.examDate && (
              <p className="text-sm text-destructive">{errors.examDate.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
