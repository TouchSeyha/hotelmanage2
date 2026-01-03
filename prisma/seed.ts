import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminEmail = 'admin@hotel.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${adminEmail}`);

    // Update role to admin if not already
    if (existingAdmin.role !== 'admin') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' },
      });
      console.log(`✓ Updated ${adminEmail} role to admin`);
    }
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        role: 'admin',
        emailVerified: new Date(),
      },
    });
    console.log(`✓ Created admin user: ${adminEmail}`);
  }

  console.log('✅ Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
