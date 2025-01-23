import dotenv from "dotenv";
import { join } from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: join(__dirname, "..", "..", "..", ".env")
  });
}

export const startupTasks = async () => {
  await ensureEnvironment();
  //
  const { connectDatabase } = await import("./mongo");
  await connectDatabase();
  //
};

async function ensureEnvironment() {
  const required = ["MONGO_URI", "KEYCLOAK_URL", "KEYCLOAK_REALM"];
  for (const key of required) {
    if (process.env[key]) continue;
    throw new Error(`Program missing value for environment variable ${key}`);
  }
}

// async function ensureSuperuser() {
//   const exists = await User.exists({ role: "admin" });
//   if (exists) return;
//   const random_password = genString("", 20);
//   await User.create({
//     name: "Admin",
//     email: "admin@livo.com",
//     password: await hashString(random_password),
//     phone: "0000000000",
//     role: "admin",
//     admin: {},
//     isMainUser: true,
//   });
//   console.log(`\n No Admin found \n Created The following: \n Email: admin@livo.ma \n Password: ${random_password}\n`);
// }
