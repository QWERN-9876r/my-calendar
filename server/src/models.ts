import mongoose, { Schema } from 'mongoose'

export const users = mongoose.model(
    'users',
    new Schema({
        email: String,
        name: String,
        theme: String,
        events: Array,
    }),
)

export const family = mongoose.model(
    'family',
    new Schema({
        participants: Array,
    }),
)
