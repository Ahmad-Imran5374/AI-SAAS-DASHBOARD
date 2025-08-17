const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const roles = ["Super_Admin", "Admin", "Manager", "User"];
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    await prisma.role.upsert({
      where: { id: i + 1 },
      update: {},
      create: { id: i + 1, name: role },
    });
  }
  console.log("✅ Roles created/ensured");

  const tenant = await prisma.tenant.upsert({
    where: { slug: "fast-5374" },
    update: {},
    create: {
      name: "FAST UNIVERSITY",
      slug: "fast-5374",
    },
  });
  console.log("✅ Tenant created/ensured:", tenant.name);

  const passwordHash = await bcrypt.hash("R@jpoot1011", 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      tenantId: tenant.id,
      email: "admin@gmail.com"
    }
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: "admin@gmail.com",
        name: "Admin",
        passwordHash,
        tenantId: tenant.id,
        roles: {
          create: {
            role: { connect: { name: "Super_Admin" } },
          },
        },
      },
    });
    console.log("✅ Admin user created:", admin.email);
  } else {
    console.log("ℹ️ Admin user already exists:", existingAdmin.email);
  }

  console.log("🎉 Seeding finished!");
}

main()
  .catch(e => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });