// src/seeders/services/main.seeder.ts
import { Injectable, Logger } from '@nestjs/common'
import { SeedUsersSeeder } from './seed-users.seeder'
import { SeedChannelSeeder } from './seed-channel.seeder'
import { Command } from 'nestjs-command'

@Injectable()
export class MainSeeder {
  private readonly logger = new Logger(MainSeeder.name)

  constructor(
    private readonly usersSeeder: SeedUsersSeeder,
    private readonly channelSeeder: SeedChannelSeeder,
  ) {}

  @Command({
    command: 'seed:all',
    describe: 'Seeds the database with initial data like users, channels, etc.',
  })
  async runAll() {
    this.logger.log('--- STARTING ALL SEEDERS ---')

    await this.channelSeeder.seedInitialChannels()
    await this.usersSeeder.seedInitialUsers()

    this.logger.log('--- ALL SEEDERS COMPLETED ---')
  }

  @Command({
    command: 'delete:all',
    describe:
      'Deletes the database with initial data like users, channels, etc.',
  })
  async deleteAll() {
    this.logger.log('--- STARTING DELETE ALL SEEDERS ---')

    await this.usersSeeder.deleteInitialUsers()

    this.logger.log('--- ALL SEEDERS COMPLETED ---')
  }
}
