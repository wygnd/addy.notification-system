import { PlatformEnum } from '@addy/common';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParsePlatformPipe implements PipeTransform<string, string> {
  private readonly platformValues = Object.values(PlatformEnum);
  private readonly excludedPlatformValues = [
    PlatformEnum.MAX,
    PlatformEnum.UNKNOWN,
  ];

  public transform(value: PlatformEnum, metadata: ArgumentMetadata): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(`${metadata.data} must be a string`);
    }

    if (
      !this.platformValues.includes(value) ||
      this.excludedPlatformValues.includes(value)
    ) {
      throw new BadRequestException(
        `${metadata.data}  must be one of the following values: ${this.platformValues.filter((p) => !this.excludedPlatformValues.includes(p)).join(', ')}`,
      );
    }

    return value;
  }
}
