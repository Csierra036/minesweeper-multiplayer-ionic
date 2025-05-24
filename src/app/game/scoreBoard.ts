export class scoreBoard{
    public minesOpen: number;
    public flagSets: number;
    public gameOver: boolean;

    constructor() {
        this.minesOpen = 0;
        this.flagSets = 0;
        this.gameOver = false;
    }

    resetScoreBoard() {
        this.minesOpen = 0;
        this.flagSets = 0;
        this.gameOver = false;
    }
}