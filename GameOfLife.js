const width = 900;
const height = 500;

class Cell
{
    constructor(isAlive = false)
    {
        this.isAlive = isAlive;
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
        if(this.isAlive)
            {
                this.timeAlive += 1;
                this.timeDead = 0;
            } else {
                this.timeDead += 1;
                this.timeAlive = 0;
            }
    }

    changeState() {
        if (!this.isAlive) {
            this.isAlive = true;
            this.timeAlive = 0;
        } else {
            this.isAlive = false;
            this.timeDead = 0;
        }
    }
}



class Mundo 
{
    constructor(rows = 50, cols = 50, fps = 10)
    {
        this.rows = rows;
        this.cols = cols;
        this.matrix = this.createWorld();
        this.showGrid = true;
        this.EasterEgg = false;
        this.isRunning = false;
        this.timer = null;
        this.fps = fps;
        this.iterations = 0;
        this.wrapAround = false;
        
        this.canvas = document.getElementById("canvasCentral");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = width; 
        this.canvas.height = height;

        this.cellWidth = this.canvas.width / this.cols;
        this.cellHeight = this.canvas.height / this.rows;

        this.canvas.addEventListener("click", (e) => this.toggleCellState(e));
        this.canvas.addEventListener("mousemove", (e) => this.showTime(e));

        const playBtn = document.getElementById("Jugar");
        playBtn.addEventListener("click", () => this.togglePlay());

        const restartBtn = document.getElementById("Reiniciar");
        restartBtn.addEventListener("click", () => this.clearWorld());

        const nextBtn = document.getElementById("Siguiente");
        nextBtn.addEventListener("click", () => this.nextIteration());

        const gridToggleCheckbox = document.getElementById("toggleGrid");
        gridToggleCheckbox.addEventListener("change", () => this.toggleGrid());

        const EasterEggCheckbox = document.getElementById("ladybugEasterEgg");
        EasterEggCheckbox.addEventListener("change", (e) => {
            this.EasterEgg = e.target.checked;
            this.paintWorld(); 
        });

        const wrapAroundCheckox = document.getElementById("wrapAround");
        wrapAroundCheckox.addEventListener("change", (e) => {
            this.wrapAround = e.target.checked;
            this.paintWorld();
        });

        const fpsSlider = document.getElementById("fpsSlider");
        fpsSlider.addEventListener("input", (e) => this.updateFPS(e));
    }


    createWorld()
    {
        const matrix = [];
        for (let i = 0; i < this.rows; i++)
        {
            const row = [];
            for (let j = 0; j < this.cols; j++)
            {
                row.push(new Cell(false));
            }
            matrix.push(row);
        }
        return matrix;
    }

    paintWorld()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    const cell  = this.matrix[i][j];
                    if(cell.isAlive){
                        if(!this.EasterEgg){
                        this.ctx.fillStyle = '#FFFFFF';
                        }else{
                        this.ctx.fillStyle = 'black';
                        }
                    } else {
                        if(!this.EasterEgg){
                            this.ctx.fillStyle = '#000F08';
                        } else {
                            this.ctx.fillStyle = 'red';   
                        }
                    }
                    this.ctx.fillRect(
                        j * this.cellWidth,
                        i * this.cellHeight,
                        this.cellWidth,
                        this.cellHeight
                    );
                }
            }

            if(!this.EasterEgg){
                this.ctx.strokeStyle = 'black';
            }else{
                this.ctx.strokeStyle = '#FFFFFF';
            }
            
            this.ctx.lineWidth = 1;
        
            //GRID
            if(this.showGrid){
            for (let i = 0; i <= this.cols; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.cellWidth, 0);
                this.ctx.lineTo(i * this.cellWidth, this.canvas.height);
                this.ctx.stroke();
            }
        

            for (let j = 0; j <= this.rows; j++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, j * this.cellHeight);
                this.ctx.lineTo(this.canvas.width, j * this.cellHeight);
                this.ctx.stroke();
            }
        }
    }

    incrementCellTimer()
    {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.matrix[i][j];
                cell.incrementTimer();
            }
        }
    }

    clearWorld()
    {
        this.iterations = 0;
        this.matrix = this.createWorld();
        this.updateWorld();
        if(this.isRunning)
        {
            this.togglePlay();
        }
    }

    nextIteration()
    {
        if(!this.isRunning)
        {
            this.updateWorld();
        }
    }

    toggleCellState(event)
    {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientY - rect.top) / this.cellHeight);
        const y = Math.floor((event.clientX - rect.left) / this.cellWidth);

        this.matrix[x][y].changeState();
        this.paintWorld();
    }

    getAliveNeighbours(x,y)
    {
        let alive = 0;
        for (let i = -1; i <=  1; i++) {
            for (let j = -1; j <= 1; j++) {
                if(i == 0 && j == 0)
                {
                    continue;
                }

                const newX = x + i ;
                const newY = y + j ;

                if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.cols) {
                    if (this.matrix[newX][newY].isAlive) {
                        alive++;
                    }
                }
            }
        }
        return alive;
    }

    getAliveNeighboursFromMatrix(matrix, x, y) {
        let alive = 0;
        let newX = 0;
        let newY = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) 
                {
                    continue;
                }
                
                if(!this.wrapAround){
                    newX = x + i;
                    newY = y + j;
                } else {
                    newX = (x + i + this.rows) % this.rows;
                    newY = (y + j + this.cols) % this.cols;
                }
                    
                if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.cols) {
                    if (matrix[newX][newY].isAlive) {
                        alive++;
                    }
                }
            }
        }
        return alive;
    }
    

    updateFPS(event)
    {
        this.fps = parseInt(event.target.value);
        document.getElementById("fpsValue").textContent = this.fps;

        if (this.isRunning) {
            clearInterval(this.timer);
            this.timer = setInterval(() => this.updateWorld(), 1000 / this.fps);
        }
    }


    updateWorld()
    {
        const originalMatrix = this.matrix.map(row => row.map(cell => ({ ...cell })));
        let anyCellAlive = false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const aliveNeighbours = this.getAliveNeighboursFromMatrix(originalMatrix, i, j);
                this.matrix[i][j].update(aliveNeighbours);
                if(this.matrix[i][j].isAlive)
                {
                    anyCellAlive = true;
                }
            }
        }

        if(anyCellAlive)
            {
                this.iterations++;
            } else {
                this.iterations = 0;
            }

        if(this.iterations <= 9999){
            document.getElementById("textocanvas").textContent = `Iteraciones: ${this.iterations}`;
        }
        else
        {
            document.getElementById("textocanvas").textContent = `Iteraciones: 9999+`;
        }
        this.paintWorld();
    }

    togglePlay()
    {
        const button = document.getElementById("Jugar")
        if(this.isRunning)
        {
            clearInterval(this.timer);
            this.isRunning = false;
            button.textContent = "Jugar";
        } else {
            this.timer = setInterval(() => this.updateWorld(), 1000 / this.fps);
            this.isRunning = true;
            button.textContent = "Pausar";
        }
    }

    showTime(event)
    {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientY - rect.top) / this.cellHeight);
        const y = Math.floor((event.clientX - rect.left) / this.cellWidth);

        const cell = this.matrix[x][y];
        const textoOut = document.getElementById("tiempo");

        if(cell.isAlive)
        {
            textoOut.textContent = `Time Alive: ${cell.timeAlive}`;
        } else {
            textoOut.textContent = `Time Dead: ${cell.timeDead}`;
        }
    }

    toggleGrid()
    {
        const gridCheck = document.getElementById("toggleGrid");
        this.showGrid = gridCheck.checked;
        this.paintWorld();
    }
}

const world = new Mundo();
world.paintWorld();