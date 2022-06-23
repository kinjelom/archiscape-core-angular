import { ILandscape } from 'app/entities/landscape/landscape.model';
import { ITeam } from 'app/entities/team/team.model';

export interface IProject {
  id?: number;
  name?: string;
  description?: string | null;
  configuration?: string | null;
  active?: boolean;
  contentStoreUrl?: string | null;
  landscape?: ILandscape;
  team?: ITeam;
}

export class Project implements IProject {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public configuration?: string | null,
    public active?: boolean,
    public contentStoreUrl?: string | null,
    public landscape?: ILandscape,
    public team?: ITeam
  ) {
    this.active = this.active ?? false;
  }
}

export function getProjectIdentifier(project: IProject): number | undefined {
  return project.id;
}
