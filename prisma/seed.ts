import { PrismaClient, Role, Category } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "saad@gmail.com" },
    update: {},
    create: {
      name: "Saad (Super Admin)",
      email: "saad@gmail.com",
      password,
      role: Role.ADMIN,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  const heads = [
    { name: "Ahmed (Web Head)", email: "ahmed@labtech.com", category: Category.WEB },
    { name: "Sara (App Head)", email: "sara@labtech.com", category: Category.APP },
    { name: "Usman (AI Head)", email: "usman@labtech.com", category: Category.AI },
    { name: "Fatima (Cyber Head)", email: "fatima@labtech.com", category: Category.CYBER_SECURITY },
  ];

  const headUsers = [];
  for (const h of heads) {
    const user = await prisma.user.upsert({
      where: { email: h.email },
      update: {},
      create: {
        name: h.name,
        email: h.email,
        password,
        role: Role.HEAD,
        category: h.category,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${h.name}`,
      },
    });
    headUsers.push(user);
  }

  const devs = [
    { name: "Ali Developer", email: "ali@labtech.com", category: Category.WEB },
    { name: "Zain Developer", email: "zain@labtech.com", category: Category.APP },
    { name: "Hira Developer", email: "hira@labtech.com", category: Category.AI },
    { name: "Omar Developer", email: "omar@labtech.com", category: Category.CYBER_SECURITY },
    { name: "Ayesha Developer", email: "ayesha@labtech.com", category: Category.WEB },
    { name: "Bilal Developer", email: "bilal@labtech.com", category: Category.APP },
  ];

  for (const d of devs) {
    await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: {
        name: d.name,
        email: d.email,
        password,
        role: Role.DEVELOPER,
        category: d.category,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.name}`,
      },
    });
  }

  const client = await prisma.user.upsert({
    where: { email: "client@labtech.com" },
    update: {},
    create: {
      name: "TechCorp Client",
      email: "client@labtech.com",
      password,
      role: Role.CLIENT,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=client",
    },
  });

  console.log("Seed completed successfully!");
  console.log("Admin: saad@gmail.com / password123");
  console.log("Heads, Developers, Client all created with password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
