import { EntityRender, EntityType } from '../Entity';

export type EntityRenderMap = Map<EntityType, EntityRender>;

export const entityRenderMap: EntityRenderMap = new Map();
