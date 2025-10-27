import { Injectable } from '@nestjs/common'
import { AlreadyExistedLanguageException } from 'src/routes/language/language.error'
import {
  CreateLanguageRequestBodyType,
  GetLanguagesListResponseType,
  LanguageDetailsType,
  UpdateLanguageRequestBodyType,
} from 'src/routes/language/language.model'
import { LanguageRepository } from 'src/routes/language/language.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async getAll(): Promise<GetLanguagesListResponseType> {
    const data = await this.languageRepository.getAll()
    return { data, totalItems: data.length }
  }

  async findById(id: string): Promise<LanguageDetailsType> {
    const language = await this.languageRepository.findById(id)
    if (!language) throw NotFoundRecordException
    return language
  }

  async create({
    data,
    createdByUserId,
  }: {
    data: CreateLanguageRequestBodyType
    createdByUserId: number
  }): Promise<LanguageDetailsType> {
    try {
      return await this.languageRepository.create({ data, createdByUserId })
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedLanguageException
      throw error
    }
  }

  async update({
    id,
    updatedByUserId,
    data,
  }: {
    id: string
    updatedByUserId: number
    data: UpdateLanguageRequestBodyType
  }): Promise<LanguageDetailsType> {
    try {
      const language = await this.languageRepository.update({ id, updatedByUserId, data })
      return language
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }

  async hardDelete(id: string): Promise<ResponseMessageType> {
    try {
      await this.languageRepository.delete(id, true)
      return { message: 'Delete language successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
