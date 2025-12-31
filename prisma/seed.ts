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

  // Create sample room types if none exist
  const roomTypeCount = await prisma.roomType.count();

  if (roomTypeCount === 0) {
    console.log('Creating sample room types...');

    await prisma.roomType.createMany({
      data: [
        {
          name: 'Standard Room',
          slug: 'standard-room',
          description:
            'A comfortable room with all essential amenities for a pleasant stay. Features a queen-size bed, work desk, and modern bathroom.',
          shortDescription: 'Comfortable room with essential amenities',
          basePrice: 89.0,
          capacity: 2,
          size: 25,
          images: JSON.stringify(['/rooms/standard-1.jpg', '/rooms/standard-2.jpg']),
          amenities: JSON.stringify([
            'Free WiFi',
            'Air Conditioning',
            'TV',
            'Mini Fridge',
            'Safe',
          ]),
        },
        {
          name: 'Deluxe Room',
          slug: 'deluxe-room',
          description:
            'Spacious room with premium furnishings and city views. Includes a king-size bed, sitting area, and luxurious bathroom with bathtub.',
          shortDescription: 'Spacious room with premium amenities and city views',
          basePrice: 149.0,
          capacity: 2,
          size: 35,
          images: JSON.stringify(['/rooms/deluxe-1.jpg', '/rooms/deluxe-2.jpg']),
          amenities: JSON.stringify([
            'Free WiFi',
            'Air Conditioning',
            'TV',
            'Mini Bar',
            'Safe',
            'Bathtub',
            'City View',
          ]),
        },
        {
          name: 'Suite',
          slug: 'suite',
          description:
            'Luxurious suite with separate living area and bedroom. Features panoramic views, premium amenities, and personalized service.',
          shortDescription: 'Luxurious suite with separate living area',
          basePrice: 249.0,
          capacity: 4,
          size: 55,
          images: JSON.stringify(['/rooms/suite-1.jpg', '/rooms/suite-2.jpg']),
          amenities: JSON.stringify([
            'Free WiFi',
            'Air Conditioning',
            'Smart TV',
            'Mini Bar',
            'Safe',
            'Jacuzzi',
            'Panoramic View',
            'Living Room',
            'Kitchen',
          ]),
        },
      ],
    });

    console.log('✓ Created sample room types');

    // Create sample rooms for each room type
    const roomTypes = await prisma.roomType.findMany();

    for (const roomType of roomTypes) {
      const roomCount = roomType.slug === 'suite' ? 2 : roomType.slug === 'deluxe-room' ? 5 : 10;
      const floorStart = roomType.slug === 'suite' ? 5 : roomType.slug === 'deluxe-room' ? 3 : 1;

      for (let i = 1; i <= roomCount; i++) {
        const floor = floorStart + Math.floor((i - 1) / 3);
        const roomNumber = `${floor}${String(i).padStart(2, '0')}`;

        await prisma.room.create({
          data: {
            roomNumber,
            roomTypeId: roomType.id,
            floor,
            status: 'available',
          },
        });
      }
    }

    console.log('✓ Created sample rooms');
  } else {
    console.log(`✓ Room types already exist (${roomTypeCount} found)`);
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
