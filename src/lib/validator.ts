import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres').max(500, 'A descrição deve ter menos de 500 caracteres'),
  location: z.string().min(3, 'O local deve ter pelo menos 3 caracteres'),
  imageUrl: z.string().url('URL inválida'),
  startDateTime: z.coerce.date().refine((data) => data > new Date(), { message: 'A data de início deve ser maior que a data atual' }),
  endDateTime: z.coerce.date(),
  categoryId: z.string(),
  isFree: z.boolean(),
  price: z.string(),
  url: z.string().url('URL inválida'),
}).refine((data) => data.endDateTime > data.startDateTime, {
  message: 'A data fim deve ser maior que a data de início',
  path: ['endDateTime'],
});
