export interface ILandscape {
  id?: string;
  description?: string | null;
  configuration?: string | null;
}

export class Landscape implements ILandscape {
  constructor(public id?: string, public description?: string | null, public configuration?: string | null) {}
}

export function getLandscapeIdentifier(landscape: ILandscape): string | undefined {
  return landscape.id;
}
