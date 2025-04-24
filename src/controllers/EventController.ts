import { Request, Response } from "express";
import Event, { IEvent } from "../models/Event";
import mongoose from "mongoose";

class EventController {
  static createEvent = async (req: Request, res: Response) => {
    const {
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      ubicacion,
      estado,
      imagen,
    } = req.body;

    try {
      if (!titulo || !descripcion || !fechaInicio || !fechaFin || !ubicacion) {
        res.status(400).json({
          message: "Todos los campos obligatorios deben ser proporcionados",
        });
        return;
      }

      if (new Date(fechaFin) < new Date(fechaInicio)) {
        res.status(400).json({
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
        return;
      }

      // Crear nuevo evento
      const newEvent = new Event({
        titulo,
        descripcion,
        fechaInicio,
        fechaFin,
        ubicacion,
        estado: estado || "activo",
        imagen: imagen || "default-event.jpg",
      });

      const savedEvent = await newEvent.save();

      res.status(201).json({
        message: "Evento creado exitosamente",
        data: {
          id: savedEvent._id,
          titulo: savedEvent.titulo,
          descripcion: savedEvent.descripcion,
          fechaInicio: savedEvent.fechaInicio,
          fechaFin: savedEvent.fechaFin,
          ubicacion: savedEvent.ubicacion,
          estado: savedEvent.estado,
          imagen: savedEvent.imagen,
        },
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ message: "Error de validación", errors });
        return;
      }

      // Manejo de otros errores
      res
        .status(500)
        .json({ message: "Error interno del servidor al crear el evento" });
    }
  };

  static GetAllEvents = async (req: Request, res: Response) => {
    try {
      const event = await Event.find();

      res.json({
        success: true,
        data: event,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error interno del servidor";
      res.status(500).json({
        success: false,
        message: "Error al obtener los eventos: " + errorMessage,
      });
    }
  };

  static GetEventById = async (req: Request, res: Response) => {
    try {
      const { Id } = req.params;
      if (!Id) {
        res.status(400).json({
          success: false,
          message: "El id es obligatorio",
        });
        return;
      }

      const event = await Event.findById(Id);

      if (!event) {
        res.status(404).json({
          success: false,
          message: "Evento no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          event,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Error al buscar el evento",
        });
      }
    }
  };

  static DeleteEvent = async (req: Request, res: Response) => {
    try {
      const { Id } = req.params;

      const event = await Event.findByIdAndDelete(Id);

      if (!event) {
        res.status(404).json({
          success: false,
          message: "Event no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        message: `Evento eliminado correctamente`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  };

  static updateEvent = async (req: Request, res: Response) => {
    const {
      Id,
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      ubicacion,
      estado,
      imagen,
    } = req.body;

    try {
      if (!mongoose.Types.ObjectId.isValid(Id)) {
        res.status(400).json({
          message: "ID de evento no válido",
        });
        return;
      }

      const existingEvent = await Event.findById(Id);
      if (!existingEvent) {
        res.status(404).json({
          message: "Evento no encontrado",
        });
        return;
      }

      if (
        fechaInicio &&
        fechaFin &&
        new Date(fechaFin) < new Date(fechaInicio)
      ) {
        res.status(400).json({
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
        return;
      }

      const updateData: any = {
        ...(titulo && { titulo }),
        ...(descripcion && { descripcion }),
        ...(fechaInicio && { fechaInicio }),
        ...(fechaFin && { fechaFin }),
        ...(ubicacion && { ubicacion }),
        ...(estado && { estado }),
        ...(imagen && { imagen }),
      };

      const updatedEvent = await Event.findByIdAndUpdate(Id, updateData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: "Evento actualizado correctamente",
        data: {
          updatedEvent,
        },
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
          message: "Error de validación",
          errors,
        });
        return;
      }

      res.status(500).json({
        message: "Error interno del servidor al actualizar el evento",
      });
    }
  };
}

export default EventController;
