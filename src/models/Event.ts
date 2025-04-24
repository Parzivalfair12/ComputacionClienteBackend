import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IEvent extends Document {
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion: string;
  estado: 'activo' | 'cancelado' | 'completado';
  imagen: string;
}

const EventSchema: Schema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['activo', 'cancelado', 'completado'],
      default: 'activo',
    },
    imagen: {
      type: String,
      default: 'default-event.jpg',
    },
  },
  {
    timestamps: true,
    strictPopulate: false
  }
);

EventSchema.pre<IEvent>('save', function (next) {
  if (this.fechaFin < this.fechaInicio) {
    throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
  }
  next();
});

EventSchema.pre<IEvent>(/^find/, function (next) {
  this.populate('organizador', 'name email');
  this.populate('participantes', 'name email');
  next();
});

const Event = mongoose.model<IEvent>('Event', EventSchema);
export default Event;