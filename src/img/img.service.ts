import { Injectable, Inject } from '@nestjs/common';
import * as sharp from 'sharp';
import { MongoClient } from 'mongodb';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImgService {
  constructor(@Inject('MongoClient') private readonly mongoClient: MongoClient) {}

  async redimensionarImagem(url: string, largura: number, fatorCompressao: number): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    const nomeArquivo = path.basename(url).replace(/\.[^/.]+$/, '');
    const extensaoArquivo = path.extname(url).split('.').pop();
    const novoNomeArquivo = `${nomeArquivo}_thumb.${extensaoArquivo}`;

    const diretorioDestino = './imagens/';
    if (!fs.existsSync(diretorioDestino)) {
      fs.mkdirSync(diretorioDestino);
    }

    const imageResized = sharp(imageBuffer).resize(720, 720, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    const caminhoDestino = path.join(diretorioDestino, novoNomeArquivo);
    if (Math.max(width, height) < 720) {
      await imageResized.toFile(caminhoDestino);
    } else {
      await imageResized.jpeg({ quality: fatorCompressao * 100 }).toFile(caminhoDestino);
    }

    const db = this.mongoClient.db('imagens');
    const imagensCollection = db.collection('imagens');

    const imagemOriginal = {
      nomeArquivo: url,
      metadata: metadata,
    };

    await imagensCollection.insertOne(imagemOriginal);

    return novoNomeArquivo;
  }
}
