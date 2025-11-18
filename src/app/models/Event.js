import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  type: { 
    type: String, 
    enum: ['meeting', 'deadline', 'training', 'task', 'project'], 
    required: true 
  },
  color: { type: String },
  description: { type: String },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  created_at: { type: Date, default: Date.now }
});

EventSchema.index({ date: 1, type: 1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);