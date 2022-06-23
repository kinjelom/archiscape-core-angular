import dayjs from 'dayjs/esm';

export interface ITextFileContent {
  id?: string;
  version?: number;
  insertDate?: dayjs.Dayjs;
  fileName?: string | null;
  content?: string;
}

export class TextFileContent implements ITextFileContent {
  constructor(
    public id?: string,
    public version?: number,
    public insertDate?: dayjs.Dayjs,
    public fileName?: string | null,
    public content?: string
  ) {}
}

export function getTextFileContentIdentifier(textFileContent: ITextFileContent): string | undefined {
  return textFileContent.id;
}
