import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('signature')
  async getUploadSignature(@Query('folder') folder: string) {
    return this.cloudinaryService.generateSignature(folder);
  }

  @Post('direct')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileDirectly(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string
  ) {
    return this.cloudinaryService.uploadFile(file, folder);
  }
}