class Unit {
  id: string = '';
  zIndex: number = 0;
  constructor(config: any) {
    config && Object.assign(this, config);
  }
}

export default Unit;
