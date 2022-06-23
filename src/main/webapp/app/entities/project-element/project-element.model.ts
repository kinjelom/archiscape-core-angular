import { IProject } from 'app/entities/project/project.model';
import { ElementType } from 'app/entities/enumerations/element-type.model';

export interface IProjectElement {
  id?: number;
  name?: string;
  type?: ElementType;
  documentation?: string | null;
  landscapeElementId?: string | null;
  project?: IProject;
}

export class ProjectElement implements IProjectElement {
  constructor(
    public id?: number,
    public name?: string,
    public type?: ElementType,
    public documentation?: string | null,
    public landscapeElementId?: string | null,
    public project?: IProject
  ) {}
}

export function getProjectElementIdentifier(projectElement: IProjectElement): number | undefined {
  return projectElement.id;
}
