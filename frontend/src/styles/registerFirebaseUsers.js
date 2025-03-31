import admin from "firebase-admin";
import fs from "fs";

// ✅ Load service account credentials
const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf-8"));

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ✅ List of users to create
const users = [
  { uid: "user1", email: "alice@example.com", password: "password123" },
  { uid: "user2", email: "bob@test.org", password: "password123" },
  { uid: "user3", email: "charlie@mail.com", password: "password123" },
  { uid: "user4", email: "diana@test.org", password: "password123" },
  { uid: "user5", email: "ethan@mail.com", password: "password123" },
  { uid: "user6", email: "fiona@test.org", password: "password123" },
  { uid: "user7", email: "george@mail.com", password: "password123" },
  { uid: "user8", email: "hannah@example.com", password: "password123" },
  { uid: "user9", email: "ian@mail.com", password: "password123" },
  { uid: "user10", email: "julia@example.com", password: "password123" }
];

// ✅ Register users
const registerUsers = async () => {
  for (const user of users) {
    try {
      const createdUser = await admin.auth().createUser({
        uid: user.uid,
        email: user.email,
        password: user.password
      });
      console.log(`✅ Registered: ${createdUser.email}`);
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        console.log(`⚠️ Already exists: ${user.email}`);
      } else {
        console.error(`❌ Failed for ${user.email}:`, error.message);
      }
    }
  }
};

registerUsers();
