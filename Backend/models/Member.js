const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // don't return password in queries by default
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    age: {
      type: Number,
      min: [16, 'Must be at least 16 years old'],
      max: [80, 'Age cannot exceed 80'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    },
    fitnessGoal: {
      type: String,
      required: [true, 'Fitness goal is required'],
      enum: [
        'Weight Loss',
        'Muscle Gain',
        'Increase Strength',
        'Improve Endurance',
        'Flexibility & Mobility',
        'General Health & Fitness',
        'Sports Performance',
      ],
    },
    membershipPlan: {
      type: String,
      required: [true, 'Membership plan is required'],
      enum: ['Starter', 'Elite', 'Pro'],
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    membershipStatus: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      default: 'pending',
    },
    membershipStartDate: {
      type: Date,
    },
    membershipEndDate: {
      type: Date,
    },
    memberId: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Generate unique member ID before saving ──
memberSchema.pre('save', async function (next) {
  // Hash password only if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Generate memberId if new document
  if (this.isNew && !this.memberId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.memberId = `IGF-${timestamp}-${random}`;
  }

  next();
});

// ── Instance method to check password ──
memberSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ── Virtual: full name ──
memberSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ── Instance method to get membership price ──
memberSchema.methods.getPlanPrice = function () {
  const prices = { Starter: 999, Elite: 1999, Pro: 3499 };
  return prices[this.membershipPlan] || 0;
};

module.exports = mongoose.model('Member', memberSchema);
