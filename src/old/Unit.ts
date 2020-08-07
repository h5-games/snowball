export interface IUnitOffset {
  top: number;
  left: number;
}

export interface IUnit {
  id: string;
  zIndex: number;
  visible: boolean;
}

class Unit implements IUnit {
  id: string = '';
  zIndex: number = 0;
  visible: boolean = true;
}

export default Unit;
