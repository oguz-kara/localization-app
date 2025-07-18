import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { Command } from 'nestjs-command'

@Injectable()
export class LanguagesSeeder {
  constructor(private readonly prisma: PrismaService) {}

  @Command({
    command: 'seed:languages',
    describe: 'Seed the database with common languages',
  })
  async seed() {
    console.log('Seeding languages...')

    const languages = [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
      },
      {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
      },
      {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
      },
      {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
      },
      {
        code: 'ru',
        name: 'Russian',
        nativeName: 'Русский',
      },
      {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
      },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
      },
      {
        code: 'zh',
        name: 'Chinese',
        nativeName: '中文',
      },
    ]

    for (const language of languages) {
      await this.prisma.language.upsert({
        where: { code: language.code },
        update: language,
        create: language,
      })
    }

    console.log('Languages seeded successfully!')
  }
}