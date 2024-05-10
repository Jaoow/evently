import EventForm from '@/components/shared/EventForm';
import { getEventById } from '@/lib/actions/event.actions';
import { currentUser } from '@clerk/nextjs/server';

type UpdateEventProps = {
  params: {
    id: string
  }
}

async function UpdateEvent({ params: { id } }: UpdateEventProps) {
  const user = await currentUser();
  const userId = user?.publicMetadata.userId as string;
  const event = await getEventById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Atualizar Evento</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          type="update"
          event={event}
          eventId={event._id}
          userId={userId}
        />
      </div>
    </>
  );
}

export default UpdateEvent;
