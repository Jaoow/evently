'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { eventFormSchema } from '@/lib/validator';
import { useUploadThing } from '@/lib/uploadthing';
import { eventDefaultValues } from '@/constants';
import { useState } from 'react';
import Image from 'next/image';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import { useRouter } from 'next/navigation';
import { IEvent } from '@/lib/database/models/event.model';
import CategoryDropdown from './CategoryDropdown';
import { Textarea } from '../ui/textarea';
import { FileUploader } from './FileUploader';
import { Checkbox } from '../ui/checkbox';

type EventFormProps = {
  userId: string;
  type: 'create' | 'update';
  event?: IEvent,
  eventId?: string,
};

function EventForm({
  userId,
  type,
  event = undefined,
  eventId = undefined,
}: EventFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const initialValues = event && type === 'update'
    ? {
      ...event,
      startDateTime: new Date(event.startDateTime),
      endDateTime: new Date(event.endDateTime),
    }
    : eventDefaultValues;

  const { startUpload } = useUploadThing('imageUploader');
  const router = useRouter();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === 'create') {
      try {
        console.log('sentEvent', { ...values, imageUrl: uploadedImageUrl });
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: '/profile',
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === 'update') {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          path: `/events/${eventId}`,
        });

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Titulo do evento" className="input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <CategoryDropdown onChangeValue={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-60">
                  <Textarea placeholder="Descrição" className="textarea rounded-2xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-60">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />

                    <Input placeholder="Localização (ou Online)" className="input-field" {...field} />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">Começo:</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Data:"
                      dateFormat="dd/MM/yyyy HH:mm"
                      wrapperClassName="datePicker"
                    />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">Fim:</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Data:"
                      dateFormat="dd/MM/yyyy HH:mm"
                      wrapperClassName="datePicker"
                    />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />

                    <Input
                      disabled={form.watch('isFree')}
                      type="number"
                      placeholder="Preço"
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />

                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field: isFreeField }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <FormLabel className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">É Gratis?</FormLabel>
                              <Checkbox
                                onCheckedChange={isFreeField.onChange}
                                checked={isFreeField.value}
                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>

                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />

                    <Input placeholder="URL" {...field} className="input-field" />
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {form.formState.isSubmitting ? 'Enviando...' : (type === 'create' ? 'Criar Evento' : 'Atualizar Evento')}
        </Button>
      </form>
    </Form>
  );
}

export default EventForm;
