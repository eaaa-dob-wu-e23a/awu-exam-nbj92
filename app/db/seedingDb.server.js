import mongoose from "mongoose";
import bcrypt from "bcrypt";

export default async function seedDb() {
  // const entryCount = await mongoose.models.Entry.countDocuments();
  const userCount = await mongoose.models.User.countDocuments();
  const eventCount = await mongoose.models.Event.countDocuments();
  if (userCount === 0 || eventCount === 0 ) {
    console.log("Seeding database...");
    insertData();
  }
}

async function insertData() {
  // const entries = [
  //   {
  //     date: new Date("2024-01-01"),
  //     type: "work",
  //     text: "I'm working",
  //   },
  //   {
  //     date: new Date("2024-01-15"),
  //     type: "learning",
  //     text: "I'm learning",
  //   },
  //   {
  //     date: new Date("2024-02-01"),
  //     type: "interesting-thing",
  //     text: "I'm doing something interesting",
  //   },
  //   {
  //     date: new Date("2024-02-15"),
  //     type: "learning",
  //     text: "Remix Auth with FormStrategy and Post App",
  //   },
  //   {
  //     date: new Date("2024-02-22"),
  //     type: "work",
  //     text: "Remix Work Journal",
  //   },
  // ];
  // await mongoose.models.Entry.insertMany(entries);
const salt = await bcrypt.genSalt(10);
  const users = [
    {
      username: "erik05",
      password: await bcrypt.hash("hejerik05",salt),
      firstName: "Erik",
      lastName: "Hansen"
    },
    // {
    //   date: new Date("2024-01-15"),
    //   type: "learning",
    //   text: "I'm learning",
    // },
    // {
    //   date: new Date("2024-02-01"),
    //   type: "interesting-thing",
    //   text: "I'm doing something interesting",
    // },
    // {
    //   date: new Date("2024-02-15"),
    //   type: "learning",
    //   text: "Remix Auth with FormStrategy and Post App",
    // },
    // {
    //   date: new Date("2024-02-22"),
    //   type: "work",
    //   text: "Remix Work Journal",
    // },
  ];
  const events = [
    {
      title: "FIDE World Chess Championships 2024",
      date: new Date(0,2,24),
      time: "12:40",
      location: "Kôln",
      description: "Vi holder VM i Köln, kom glad hvis du har en rating over 2400. eller bare gerne vil overvære god skak."
    }, {
      title: "Airthings Masters 2024",
      date: new Date(0,5,4),
      time: "09:00",
      location: "Kôln",
    },

    // {
    //   date: new Date("2024-01-15"),
    //   type: "learning",
    //   text: "I'm learning",
    // },
    // {
    //   date: new Date("2024-02-01"),
    //   type: "interesting-thing",
    //   text: "I'm doing something interesting",
    // },
    // {
    //   date: new Date("2024-02-15"),
    //   type: "learning",
    //   text: "Remix Auth with FormStrategy and Post App",
    // },
    // {
    //   date: new Date("2024-02-22"),
    //   type: "work",
    //   text: "Remix Work Journal",
    // },
  ];

  await mongoose.models.User.insertMany(users);
  await mongoose.models.Event.insertMany(events);
}
