var rows = 900;
var col = 500;

class Cell
{
    constructor(isAlive = false)
    {
        this.state = isAlive;
        this.timeAlive = 0;
        this.timeDead = 0;
    }

    update(aliveNeighbours)
    {
        if(this.isAlive)
        {
            if(aliveNeighbours < 2 || aliveNeighbours > 3)
            {
                this.changeState();
            }
        } else {
            if(aliveNeighbours == 3)
                this.changeState();
        }

        this.updateTimer();
    }

    updateTimer()
    {
        if(isAlive)
            {
                this.timeAlive =+ 1;
            } else {
                this.timeDead =+ 1;
            }
    }

    changeState()
    {
        this.state = !this.state;
        this.timeAlive = 0;
        this.timeDead = 0;
    }
}



class Mundo 
{
    constructor(rows , cols)
    {
        this.rows = rows;
        this.cols = cols;
        this.matrix = this.createWorld();
        this.canvas = document.getElementById('canvasCentral');
        this.ctx = canvas.getContext('2d');
        this.cellSize = Math.min(this.canvas.width / this.cols , this.canvas.height / this.rows );
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;

        this.canvas.addEventListener('click', (e) => this.toggleCellState(e));
    }


    createWorld()
    {
        const matrix = [];
        for (let i = 0; i < this.rows; i++)
        {
            const lines = [];
            for (let j = 0; j < this.cols; j++)
            {
                lines.push(new Cell(false));
            }
            matrix.push(line);
        }
        return matrix;
    }

    paintWorld()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    const cell  = this.matrix[i][j];
                    if(cell.state){
                        this.ctx.fillStyle = '#FFFFFF';
                    } else {
                        this.ctx.fillStyle = '#000F08';
                    }
                    this.ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
                    this.ctx.strokeStyle = 'black';
                    this.ctx.strokeRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize); 
                }
            }
    }

    toggleCellState(event)
    {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientY - rect.top) / this.cellSize);
        const y = Math.floor((event.clientX - rect.left) / this.cellSize);
        this.matrix[x][y].changeState();

        this.paintWorld();
    }
}

canvas.width = rows; 
canvas.height = cols; 
ctx.fillStyle = '#000F08';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#FFFFFF';
ctx.lineWidth = 1;

for (let x = 0; x <= canvas.width; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
}

for (let y = 0; y <= canvas.height; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
}
