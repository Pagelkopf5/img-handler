import { Controller, Post, Body } from '@nestjs/common';
import { ImgService } from './img.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RedimensionarImagemRequest } from './types';


@Controller('img')
export class ImgController {
  constructor(private readonly imgService: ImgService) {}

  @Post('redimensionar')
  async redimensionarImagem(@Body() request: RedimensionarImagemRequest) {
    const { image, compress } = request;
    const novoNomeArquivo = await this.imgService.redimensionarImagem(image, 720, compress);
    return { novoNomeArquivo };
  }
}
