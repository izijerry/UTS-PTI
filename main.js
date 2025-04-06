const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1026
canvas.height = 576


const collisionsmap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsmap.push(collisions.slice(i, 70 + i))

}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

console.log(battleZonesMap)

const boundaries = []
const offset = {
    x: -100,
    y: -500
}
collisionsmap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            boundaries.push(new boundary({
                position: {
                    x: j * boundary.width + offset.x,
                    y: i * boundary.height + offset.y
                }
            }))
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            battleZones.push(new boundary({
                position: {
                    x: j * boundary.width + offset.x,
                    y: i * boundary.height + offset.y
                }
            }))
    })
})

console.log(battleZones)


const image = new Image()
image.src = './img/map.png'


const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

const playerdownimage = new Image()
playerdownimage.src = './img/playerDown.png'

const playerupimage = new Image()
playerupimage.src = './img/playerUp.png'

const playerleftimage = new Image()
playerleftimage.src = './img/playerLeft.png'

const playerrightimage = new Image()
playerrightimage.src = './img/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 400 / 2,
        y: canvas.height / 2 - 300 / 2
    },
    image: playerdownimage,
    frames: {
        max: 4,
        hold: 20
    },
    sprites: {
        up: playerupimage,
        left: playerleftimage,
        right: playerrightimage,
        down: playerdownimage,
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}



const moveables = [background, ...boundaries, foreground, ...battleZones]

function rectangularcollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
const battle = {
    initated: false
}


function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    console.log(animationId)
    if (battle.initated) return

    //activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea =
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) -
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                    Math.max(player.position.y, battleZone.position.y))
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2
                && Math.random() < 0.01
            ) {
                console.log('activate battle')

                //deactivate current animation loop
                window.cancelAnimationFrame(animationId)

                battle.initated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                //activate a new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })


                    }
                })
                break
            }
        }
    }


    if (keys.w.pressed && lastkey === 'w') {
        player.animate = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }



        if (moving)
            moveables.forEach(moveable => { moveable.position.y += 3 })
    }
    else if (keys.a.pressed && lastkey === 'a') {
        player.animate = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.x += 3 })
    }
    else if (keys.s.pressed && lastkey === 's') {
        player.animate = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.y -= 3 })
    }
    else if (keys.d.pressed && lastkey === 'd') {
        player.animate = true
        player.image = player.sprites.right

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('colliding')
                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.x -= 3 })
    }

}
// animate()


let lastkey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})