import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["macho", "hembra", "desconocido"],
      default: "desconocido",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pet", petSchema);
