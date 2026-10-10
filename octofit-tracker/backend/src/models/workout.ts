import { model, Schema } from 'mongoose'

const workoutSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['cardio', 'strength', 'flexibility'] },
  difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
  durationMinutes: { type: Number, required: true, min: 1 },
  exercises: [{ type: String, required: true }],
}, { timestamps: true })

export default model('Workout', workoutSchema)
