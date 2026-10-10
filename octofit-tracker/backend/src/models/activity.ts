import { model, Schema } from 'mongoose'

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  type: { type: String, required: true, enum: ['running', 'cycling', 'walking', 'swimming', 'strength'] },
  durationMinutes: { type: Number, required: true, min: 1 },
  distanceKm: { type: Number, min: 0 },
  calories: { type: Number, required: true, min: 0 },
  completedAt: { type: Date, required: true },
}, { timestamps: true })

export default model('Activity', activitySchema)
