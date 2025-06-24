export class Cell{
    mine: boolean = false;
    revelated: boolean  = false;
    flag: number  = 0 ;
    flagImage: string = '';
    adjacentMines: number = 0
}