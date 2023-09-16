const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const audio = new Audio("../assets/audio.mp3")
const audio2 = new Audio("../assets/gameover.mp3")

const body = document.body


const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const size = 30 // Tamanho fixo do quadrado

const incrementScore = () => {
    score.innerHTML = +score.innerHTML + 10
}

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomColor = () =>{
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}


const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let loopId
let direction = "left"

const drawSnake = () => {
    snake.forEach((position, index) => {
        if (index == snake.length - 1){ctx.fillStyle = "white"}
        ctx.fillRect(position.x, position.y, size, size)

    })
}

const drawFood = () => {
    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)

    ctx.shadowBlur = 0
}

const moveSnake = () => {
    if(!direction) return
    const headSnake = snake[snake.length - 1]
    
    if(direction == "right"){
        snake.push({x: headSnake.x + size, y: headSnake.y})
    }

    if(direction == "left"){
        snake.push({x: headSnake.x - size, y: headSnake.y})
    }
    
    if(direction == "down"){
        snake.push({x: headSnake.x, y: headSnake.y + size})
    }
    
    if(direction == "up"){
        snake.push({x: headSnake.x, y: headSnake.y - size})
    }

    snake.shift()
}

const drawGrid =  () =>{
    ctx.lineWidth = 1
    ctx.strokeStyle = "191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
    
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
    
        ctx.stroke()
    }


}

const checkEat = () =>{
    const headSnake = snake[snake.length - 1]
    
    if(headSnake.x == food.x && headSnake.y == food.y){
        //body.style.backgroundColor = food.color
        ctx.fillStyle = food.color
        incrementScore()
        snake.push(headSnake)
        audio.play()
        
        let x = randomPosition()
        let y = randomPosition()
        
        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition
            y = randomPosition
        }

        food.x = x
        food.y = y
        food.color = randomColor()
        

    }
}

const checkCollision = () =>{
    const headSnake = snake[snake.length - 1]
    const neckIndex = snake.length - 2

    const wallCollision =  headSnake.x < 0 || headSnake.x > canvas.width - size 
    || headSnake.y < 0 || headSnake.y > canvas.width - size

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == headSnake.x && position.y == headSnake.y
    })

    if(wallCollision || selfCollision){
        audio2.play()
        gameOver()
    }
    
    
}


const gameOver = () =>{
    audio2.pause()

    direction = undefined

    menu.style.display = "flex"
    finalScore.innerHTML = score.innerHTML
    canvas.style.filter = "blur(2px)"


}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()

    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() =>{
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener("keydown", (event) =>{
    if (event.key == "ArrowUp" && direction !== "down"){
        direction = "up"
    }

    if (event.key == "ArrowDown" && direction !== "up"){
        direction = "down"
    }

    if (event.key == "ArrowLeft" && direction !== "right"){
        direction = "left"
    }

    if (event.key == "ArrowRight" && direction !== "left"){
        direction = "right"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerHTML = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})