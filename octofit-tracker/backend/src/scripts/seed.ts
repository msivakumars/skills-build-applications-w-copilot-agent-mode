import mongoose from 'mongoose'
import activity from '../models/activity.js'
import leaderboard from '../models/leaderboard.js'
import team from '../models/team.js'
import user from '../models/user.js'
import workout from '../models/workout.js'

const connectionString = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db'

/**
 * Seed the octofit_db database with test data.
 */
async function seedDatabase() {
  await mongoose.connect(connectionString)

  try {
    await Promise.all([
      activity.deleteMany({}),
      leaderboard.deleteMany({}),
      team.deleteMany({}),
      user.deleteMany({}),
      workout.deleteMany({}),
    ])

    const users = await user.insertMany([
      { name: 'Avery Chen', email: 'avery.chen@example.com', age: 29 },
      { name: 'Jordan Rivera', email: 'jordan.rivera@example.com', age: 34 },
      { name: 'Morgan Patel', email: 'morgan.patel@example.com', age: 26 },
      { name: 'Taylor Brooks', email: 'taylor.brooks@example.com', age: 31 },
    ])

    const teams = await team.insertMany([
      {
        name: 'Trail Blazers',
        description: 'Outdoor miles and steady progress.',
        members: [users[0]._id, users[1]._id],
        points: 1840,
      },
      {
        name: 'Pulse Collective',
        description: 'A balanced mix of cardio and strength.',
        members: [users[2]._id, users[3]._id],
        points: 1625,
      },
    ])

    await user.bulkWrite([
      { updateOne: { filter: { _id: users[0]._id }, update: { team: teams[0]._id } } },
      { updateOne: { filter: { _id: users[1]._id }, update: { team: teams[0]._id } } },
      { updateOne: { filter: { _id: users[2]._id }, update: { team: teams[1]._id } } },
      { updateOne: { filter: { _id: users[3]._id }, update: { team: teams[1]._id } } },
    ])

    const now = new Date()
    const day = 24 * 60 * 60 * 1000
    await activity.insertMany([
      { user: users[0]._id, team: teams[0]._id, type: 'running', durationMinutes: 32, distanceKm: 5.2, calories: 340, completedAt: new Date(now.getTime() - day) },
      { user: users[1]._id, team: teams[0]._id, type: 'cycling', durationMinutes: 45, distanceKm: 16.4, calories: 410, completedAt: new Date(now.getTime() - 2 * day) },
      { user: users[2]._id, team: teams[1]._id, type: 'strength', durationMinutes: 38, calories: 260, completedAt: new Date(now.getTime() - day) },
      { user: users[3]._id, team: teams[1]._id, type: 'walking', durationMinutes: 50, distanceKm: 4.1, calories: 220, completedAt: new Date(now.getTime() - 3 * day) },
    ])

    await leaderboard.insertMany([
      { user: users[0]._id, team: teams[0]._id, points: 980, rank: 1, period: 'weekly' },
      { user: users[2]._id, team: teams[1]._id, points: 865, rank: 2, period: 'weekly' },
      { user: users[1]._id, team: teams[0]._id, points: 860, rank: 3, period: 'weekly' },
      { user: users[3]._id, team: teams[1]._id, points: 760, rank: 4, period: 'weekly' },
    ])

    await workout.insertMany([
      {
        name: 'Easy 5K Builder',
        description: 'A conversational-pace run to build aerobic endurance.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 30,
        exercises: ['5-minute brisk walk', '20-minute easy run', '5-minute cool-down walk'],
      },
      {
        name: 'Full-Body Foundations',
        description: 'A simple strength circuit focused on good form.',
        category: 'strength',
        difficulty: 'beginner',
        durationMinutes: 35,
        exercises: ['Bodyweight squats', 'Incline push-ups', 'Glute bridges', 'Dead bugs'],
      },
      {
        name: 'Tempo Ride',
        description: 'A steady cycling session with short tempo efforts.',
        category: 'cardio',
        difficulty: 'intermediate',
        durationMinutes: 40,
        exercises: ['8-minute warm-up', '4 x 4-minute tempo', '8-minute easy spin'],
      },
      {
        name: 'Mobility Reset',
        description: 'Gentle mobility work for recovery and range of motion.',
        category: 'flexibility',
        difficulty: 'beginner',
        durationMinutes: 20,
        exercises: ['Cat-cow stretches', 'World’s greatest stretch', 'Hamstring mobility', 'Child’s pose'],
      },
    ])

    console.log('Connected to octofit_db')
    console.log('Created 4 users, 2 teams, 4 activities, 4 leaderboard entries, and 4 workouts.')
    console.log('Database seeding complete')
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error)
  process.exitCode = 1
})
