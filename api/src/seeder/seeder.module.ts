import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { SeedUsersSeeder } from './seeders/seed-users.seeder'
import { MainSeeder } from './seeders/main.seeder'
import { SeedChannelSeeder } from './seeders/seed-channel.seeder'
import { BuildAddressJsonSeeder } from './seeders/build-address.seeder'

@Module({
  imports: [],
  providers: [
    MainSeeder,
    PrismaService,
    SeedUsersSeeder,
    SeedChannelSeeder,
    BuildAddressJsonSeeder,
  ],
})
export class SeederModule {}
