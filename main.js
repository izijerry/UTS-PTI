const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight - document.getElementById('status-container').offsetHeight
}

resizeCanvas()

window.addEventListener('resize', () => {
    resizeCanvas()
    // You might need to adjust player position or other elements here
})



const collisionsmap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsmap.push(collisions.slice(i, 70 + i))
}

const colRumahMap = []
for (let i = 0; i < colRumahData.length; i += 70) {
    colRumahMap.push(colRumahData.slice(i, 70 + i))
}

const colLakeMap = []
for (let i = 0; i < colLakeData.length; i += 70) {
    colLakeMap.push(colLakeData.slice(i, 70 + i))
}

const colBarMap = []
for (let i = 0; i < colBarData.length; i += 70) {
    colBarMap.push(colBarData.slice(i, 70 + i))
}

const colGunungMap = []
for (let i = 0; i < colGunungData.length; i += 70) {
    colGunungMap.push(colGunungData.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}


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


const colRumah = []
colRumahMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            colRumah.push(new boundary({
                position: {
                    x: j * boundary.width + offset.x,
                    y: i * boundary.height + offset.y
                }
            }))
    })
})

const colBar = []
colBarMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            colBar.push(new boundary({
                position: {
                    x: j * boundary.width + offset.x,
                    y: i * boundary.height + offset.y
                }
            }))
    })
})

const colLake = []
colLakeMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            colLake.push(new boundary({
                position: {
                    x: j * boundary.width + offset.x,
                    y: i * boundary.height + offset.y
                }
            }))
    })
})

const colGunung = []
colGunungMap.forEach((row, i) => {
    row.forEach((Symbol, j) => {
        if (Symbol === 1025)
            colGunung.push(new boundary({
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
        x: canvas.width / 2 - 192 / 4,  // Adjusted for sprite size
        y: canvas.height / 2 - 68 / 2    // Adjusted for sprite size
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
    },
    shift: { pressed: false } //buat lari
}



const moveables = [background, ...boundaries, foreground, ...battleZones, ...colRumah, ...colBar, ...colGunung, ...colLake]

function rectangularcollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width > rectangle2.position.x &&
        rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height > rectangle2.position.y &&
        rectangle1.position.y < rectangle2.position.y + rectangle2.height
    )
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
    colRumah.forEach(colruma => {
        colruma.draw()
    })
    colBar.forEach(colruma => {
        colruma.draw()
    })
    colLake.forEach(colruma => {
        colruma.draw()
    })
    colGunung.forEach(colruma => {
        colruma.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    // Calculate movement speed based on running
    const baseSpeed = 3
    const runSpeed = 6
    const currentSpeed = keys.shift.pressed ? runSpeed : baseSpeed

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


                //deactivate current animation loop
                window.cancelAnimationFrame(animationId)


                audio.Map.stop()
                audio.initBattle.play()
                audio.battle.play()

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

   // masuk rumah
if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    let location = ''
    let locationFound = false

    // Cek collision dengan semua area
    const checkCollision = (area) => {
        for (let i = 0; i < area.length; i++) {
            if (rectangularcollision({
                rectangle1: player,
                rectangle2: area[i]
            })) {
                return true
            }
        }
        return false
    }

    if (checkCollision(colRumah)) {
        location = 'Rumah'
        locationFound = true
    } else if (checkCollision(colBar)) {
        location = 'Bar'
        locationFound = true
    } else if (checkCollision(colLake)) {
        location = 'Danau'
        locationFound = true
    } else if (checkCollision(colGunung)) {
        location = 'Gunung'
        locationFound = true
    }

    const locationElement = document.getElementById('locationName')
    if (locationFound) {
        locationElement.textContent = location
        locationElement.style.display = 'block'
        
        // Tambahkan timeout untuk menyembunyikan setelah beberapa detik
        clearTimeout(window.locationTimeout)
        window.locationTimeout = setTimeout(() => {
            locationElement.style.display = 'none'
        }, 2000)
    } else {
        locationElement.style.display = 'none'
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
                            y: boundary.position.y + currentSpeed // Use currentSpeed
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }

        if (moving)
            moveables.forEach(moveable => { moveable.position.y += currentSpeed })
        reduceStatusOnMove(keys.shift.pressed ? 2 : 1) // Faster depletion when running
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
                            x: boundary.position.x + currentSpeed, // Use currentSpeed
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.x += currentSpeed })
        reduceStatusOnMove(keys.shift.pressed ? 2 : 1)
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
                            y: boundary.position.y - currentSpeed // Use currentSpeed
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.y -= currentSpeed })
        reduceStatusOnMove(keys.shift.pressed ? 2 : 1)
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
                            x: boundary.position.x - currentSpeed, // Use currentSpeed
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.x -= currentSpeed })
        reduceStatusOnMove(keys.shift.pressed ? 2 : 1)
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
        case 'Shift': //buat lari
            keys.shift.pressed = true
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
        case 'Shift': // lari
            keys.shift.pressed = false
            break
    }
})

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})






let status = {
    hunger: 75,
    energy: 60,
    hygiene: 90,
    happiness: 80,
    money: 50000
};

function updateBar(name, value, isMoney = false) {
    const bar = document.getElementById(`${name}-bar`);
    const text = document.getElementById(`${name}-text`);
    if (!isMoney) {
        value = Math.max(0, Math.min(100, value));
        bar.style.width = value + "%";
        text.textContent = Math.round(value) + "%";
    } else {
        text.textContent = "Rp " + value.toLocaleString("id-ID");
    }
}

function renderStatus() {
    updateBar("hunger", status.hunger);
    updateBar("energy", status.energy);
    updateBar("hygiene", status.hygiene);
    updateBar("happiness", status.happiness);
    updateBar("money", status.money, true);
}


// Contoh integrasi: setiap jalan, kurangi energy
function reduceStatusOnMove(multiplier = 1) {
    status.energy -= 0.03 * multiplier;
    status.hunger -= 0.02 * multiplier;
    status.happiness -= 0.01 * multiplier;
    renderStatus();
}
renderStatus();


//buat tombol maju di layar
const controls = {
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),
};

controls.up.addEventListener('pointerdown', () => {
    keys.w.pressed = true
    lastkey = 'w'
})
controls.up.addEventListener('pointerup', () => {
    keys.w.pressed = false
})
controls.down.addEventListener('pointerdown', () => {
    keys.s.pressed = true
    lastkey = 's'
})
controls.down.addEventListener('pointerup', () => {
    keys.s.pressed = false
})

controls.left.addEventListener('pointerdown', () => {
    keys.a.pressed = true
    lastkey = 'a'
})
controls.left.addEventListener('pointerup', () => {
    keys.a.pressed = false
})

controls.right.addEventListener('pointerdown', () => {
    keys.d.pressed = true
    lastkey = 'd'
})
controls.right.addEventListener('pointerup', () => {
    keys.d.pressed = false
})
// Tambahkan di bagian controls
const runButton = document.getElementById('run');

runButton.addEventListener('pointerdown', () => {
    keys.shift.pressed = true;
    runButton.classList.add('active');
});

runButton.addEventListener('pointerup', () => {
    keys.shift.pressed = false;
    runButton.classList.remove('active');
});

// Untuk touch devices
runButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.shift.pressed = true;
    runButton.classList.add('active');
});

runButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.shift.pressed = false;
    runButton.classList.remove('active');
});