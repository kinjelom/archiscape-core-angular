import { ILandscape } from 'app/entities/landscape/landscape.model';
import { ElementType } from 'app/entities/enumerations/element-type.model';

export interface ILandscapeElement {
  id?: string;
  type?: ElementType;
  documentation?: string | null;
  landscape?: ILandscape;
}

export class LandscapeElement implements ILandscapeElement {
  constructor(public id?: string, public type?: ElementType, public documentation?: string | null, public landscape?: ILandscape) {}
}

export function getLandscapeElementIdentifier(landscapeElement: ILandscapeElement): string | undefined {
  return landscapeElement.id;
}
