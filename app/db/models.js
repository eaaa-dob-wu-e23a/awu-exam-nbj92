import { mongoose } from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const entrySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["work", "learning", "interesting-thing"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  // Automatically add `createdAt` and `updatedAt` timestamps:
  // https://mongoosejs.com/docs/timestamps.html
  { timestamps: true },
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username Required"],
      minLength: [5, "Username Too Short. (5 characters required)"],
      maxLength: [20, "Username Too Long. (Max 20 characters allowed)"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password Required"],
      minLength: [8, "Password Too Short. (8 characters required)"],
      select: false
    },
    firstName: {
      type: String,
      required: [true, "Firstname Required"],
    },
    lastName: {
      type: String,
      required: [true, "Lastname Required"],
    }
  },
  // Automatically add `createdAt` and `updatedAt` timestamps:
  // https://mongoosejs.com/docs/timestamps.html
  { timestamps: true },
);
// console.log(userSchema);
// console.log(userSchema.obj.username);
// console.log(userSchema.obj.firstName);
// console.log(userSchema.obj.lastName);

const userSubschema = new Schema(
  {
    username: {type: String,
      required: [true, "Username Required"],
      minLength: [5, "Username Too Short. (5 characters required)"],
      maxLength: [20, "Username Too Long. (Max 20 characters allowed)"],
      },
    firstName: userSchema.obj.firstName,
    lastName: userSchema.obj.lastName
  }
);

// console.log(userSubschema);

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title Required"],
      minLength: [10, "Title Too Short. (10 Characters required)"],
      maxLength: [40, "Title Too Long. (Max 40 Characters)"],
      unique: [true, "Username already exists"]
    },
    date: {
      type: Date,
      required: [true, "Date Required"],
    },
    time: {
      type: String,
      required: [true, "Time Required"],
    },
    location: {
      type: String,
      required: [true, "Location Required"],
    },
    description: {
      type: String,
      default: "This Event has no description",
      maxLength: [200, "Description Too Long. (Max 200 Characters"]
    },
    user: {
      type: userSubschema,
      // type: Schema.Types.ObjectId,
      // ref: 'User',
      required: true,
    }
  },
  // Automatically add `createdAt` and `updatedAt` timestamps:
  // https://mongoosejs.com/docs/timestamps.html
  { timestamps: true },
);

userSchema.pre("save", async function(next) {
  const user = this;

  if(!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
})


// For each model you want to create, please define the model's name, the
// associated schema (defined above), and the name of the associated collection
// in the database (which will be created automatically).
export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
  {
    name: "UserSub",
    schema: userSubschema,
    collection: "events",
  },
  {
    name: "Event",
    schema: eventSchema,
    collection: "events",
  },
  {
    name: "Entry",
    schema: entrySchema,
    collection: "entries",
  },
];