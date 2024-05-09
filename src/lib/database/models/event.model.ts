import {
  Schema, Document, model, models,
} from 'mongoose';

export interface IEvent extends Document {
  _id: string;
  title: string;
  description: string;
  location: string;
  photo: string;
  startDateTime: Date;
  endDateTime: Date;
  price: number;
  isFree: boolean;
  url: string;
  category: { _id: string; name: string };
  organizer: { _id: string; firstName: string, lastName: string };
  createdAt: Date;
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  photo: { type: String, required: false },

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },

  price: { type: Number, required: true },
  isFree: { type: Boolean, default: false },

  url: { type: String, required: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, default: Date.now },
});

const Event = models.Event || model('Event', EventSchema);

export default Event;
