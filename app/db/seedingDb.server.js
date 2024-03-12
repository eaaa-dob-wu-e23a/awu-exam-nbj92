import mongoose from "mongoose";
import bcrypt from "bcrypt";

export default async function seedDb() {
  // const entryCount = await mongoose.models.Entry.countDocuments();
  const userCount = await mongoose.models.User.countDocuments();
  const eventCount = await mongoose.models.Event.countDocuments();
  if (userCount === 0 && eventCount === 0 ) {
    console.log("Seeding database...");
    insertData();
  }
}

async function insertData() {
  const User = mongoose.models.User;
  const Event = mongoose.models.Event;
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
      password: await bcrypt.hash("erik1234",salt),
      firstName: "Erik",
      lastName: "Hansen"
    },
    {
      username: "Kisser",
      password: await bcrypt.hash("kisser1234",salt),
      firstName: "Kirsten",
      lastName: "Klausen"
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
  
  if(await User.countDocuments() === 0) {
    // await mongoose.models.User.insertMany(users);
    var erik = await User.create(
      {
        username: "erik05",
        password: "erik1234", //await bcrypt.hash("erik1234",salt),
        firstName: "Erik",
        lastName: "Hansen"
      });
    var kisser = await User.create({
      username: "Kisser",
      password: "kisser1234", //await bcrypt.hash("kisser1234",salt),
      firstName: "Kirsten",
      lastName: "Klausen"
    });
  }
  if(await Event.countDocuments() === 0) {

    erik.password = undefined;
    kisser.password = undefined;
    const events = [
      {
        title: "FIDE World Chess Championships 2024",
        date: new Date(2024,2,24),
        time: "12:40",
        location: "Köln",
        description: "Vi holder VM i Köln, kom glad hvis du har en rating over 2400. eller bare gerne vil overvære god skak.",
        // user: erik._id
        user: erik
  
      }, {
        title: "Airthings Masters 2024",
        date: new Date(2023,5,4),
        time: "09:00",
        location: "Köln",
        // user: kisser._id
        user: kisser
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
  await Event.insertMany(events);
  }
}
