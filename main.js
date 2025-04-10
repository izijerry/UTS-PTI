const audioMendaki = new Audio('./audio/ambatukam.mp3');
let playerselect, playerup, playerdown, playerright, playerleft;
let status = {
    hunger: 70,
    energy: 100,
    hygiene: 100,
    happiness: 100,
    gold: 0,
}

document.getElementById("startGame").addEventListener("click", function () {
    const carousel = document.getElementById("characterSelection");
    const activeItem = carousel.querySelector(".carousel-item.active img");

    switch (activeItem.alt) {
        case "Character 1":
            playerup = "./img/playerUp.png";
            playerdown = "./img/playerDown.png";
            playerleft = "./img/playerLeft.png";
            playerright = "./img/playerRight.png";
            playerselect = 'player 1';
            break;
        case "Character 2":
            playerup = "./img/playerUp2.png";
            playerdown = "./img/playerDown2.png";
            playerleft = "./img/playerLeft2.png";
            playerright = "./img/playerRight2.png";
            playerselect = 'player 2';
            break;
        case "Character 3":
            playerup = "./img/playerUp3.png";
            playerdown = "./img/playerDown3.png";
            playerleft = "./img/playerLeft3.png";
            playerright = "./img/playerRight3.png";
            playerselect = 'player 3';
            break;
        default:
            console.error("No character selected!");
            return; // Menghentikan fungsi jika tidak ada karakter yang dipilih
    }
    playerdownimage.src = playerdown;
    playerupimage.src = playerup;
    playerleftimage.src = playerleft;
    playerrightimage.src = playerright;
    // Inisialisasi gambar karakter setelah pemilihan
    console.log("Selected character:", playerselect);
});

// menu
const menu = document.getElementById('menu');
const startGame = document.getElementById('startGame');
const instructionsButton = document.getElementById('instructions');
const exitGameButton = document.getElementById('exitGame');
const gameContainer = document.getElementById('gameContainer');
const statusBars = document.getElementById('statusBars');

startGame.addEventListener('click', () => {
    menu.style.display = 'none'; // Sembunyikan menu
    statusBars.style.display = 'flex'; // Tampilkan status bar
});
// Fungsi untuk menampilkan petunjuk
instructionsButton.addEventListener('click', () => {
    alert("Petunjuk:\n- Gunakan tombol panah atau WASD keyboard untuk bergerak.\n- Jelajahi lokasi dan tingkatkan statusmu!");
});

// canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1026
canvas.height = 576

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


//character
const playerdownimage = new Image()
const playerupimage = new Image()
const playerrightimage = new Image()
const playerleftimage = new Image()


playerdownimage.src = './img/playerDown.png'


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



const moveables = [background, ...boundaries, foreground, ...battleZones, ...colRumah, ...colBar, ...colGunung, ...colLake]

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

let animationId;






// SHOWMESSAGE UANG TIDAK CUKUP
function showMessage(text) {
    const box = document.getElementById('messageBox');
    box.innerText = text;
    box.style.display = 'block';

    clearTimeout(box.hideTimeout);
    box.hideTimeout = setTimeout(() => {
        box.style.display = 'none';
    }, 3000);
}

// UPDATE UI BAR
function updateStatusBars() {
    document.getElementById("hungerBar").style.width = status.hunger + "%";
    document.getElementById("energyBar").style.width = status.energy + "%";
    document.getElementById("hygieneBar").style.width = status.hygiene + "%";
    document.getElementById("happinessBar").style.width = status.happiness + "%";
    document.getElementById("goldAmount").innerText = status.gold;
    checkAllStatus(); 
}


// KURANGI STATUS SAAT BERGERAK
function reduceStatusOnMove() {
    if (status.hunger > 0) status.hunger -= 0.01;
    if (status.energy > 0) status.energy -= 0.02;
    if (status.hygiene > 0) status.hygiene -= 0.01;
    updateStatusBars();
    checkAllStatus();
}

function animate() {
    const animationId = window.requestAnimationFrame(animate);
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
        const interactionMenu = document.getElementById('interactionMenu')
        interactionMenu.innerHTML = ''
        for (let i = 0; i < colRumah.length; i++) {
            const colrumah = colRumah[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: colrumah
                })
            ) {
                location = 'Rumah'
                // Tambahkan aksi di Rumah
                const makanBtn = document.createElement('button')
                makanBtn.innerText = '🍽 Makan'
                makanBtn.onclick = () => {
                    status.hunger = Math.min(100, status.hunger + 15)
                    updateStatusBars()
                }

                const tidurBtn = document.createElement('button')
                tidurBtn.innerText = '🛏 Tidur'
                tidurBtn.onclick = () => {
                    status.energy = Math.min(100, status.energy + 20)
                    updateStatusBars()
                }

                const mandiBtn = document.createElement('button')
                mandiBtn.innerText = '🚿 Mandi'
                mandiBtn.onclick = () => {
                    status.hygiene = Math.min(100, status.hygiene + 50)
                    updateStatusBars()
                }

                interactionMenu.appendChild(makanBtn)
                interactionMenu.appendChild(tidurBtn)
                interactionMenu.appendChild(mandiBtn)
                interactionMenu.style.display = 'block'
                break
            }
        }

        for (let i = 0; i < colBar.length; i++) {
            const colbar = colBar[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: colbar
                })
            ) {
                location = 'Bar'
                // Aksi di Bar
                const minumBtn = document.createElement('button')
                minumBtn.innerText = '🍹 Minum (10G)'
                minumBtn.onclick = () => {
                    if (status.gold >= 10) {
                        status.gold -= 10
                        status.happiness = Math.min(100, status.happiness + 20)
                        status.hunger = Math.min(100, status.hunger + 20)
                        showMessage('🥴 Kamu merasa tipsy! +20 Happiness')
                        updateStatusBars()
                    } else {
                        showMessage('💸 Uangmu tidak cukup untuk minum!')
                    }
                }

                interactionMenu.appendChild(minumBtn)
                interactionMenu.style.display = 'block'
                break
            }
        }

        for (let i = 0; i < colLake.length; i++) {
            const collake = colLake[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: collake
                })
            ) {
                location = 'Lake'
                const mancingBtn = document.createElement('button')
                mancingBtn.innerText = '🎣 Mancing (5G)'
                mancingBtn.onclick = () => {
                    if (status.gold >= 5) {
                        status.gold -= 5
                        status.happiness = Math.min(100, status.happiness + 15)
                        status.energy = Math.max(0, status.energy - 10)
                        showMessage('🐟 Strike!!! +15 Happiness')
                        updateStatusBars()
                    } else {
                        showMessage('💸 Uangmu tidak cukup untuk mancing!')
                    }
                }

                interactionMenu.appendChild(mancingBtn)
                interactionMenu.style.display = 'block'
                break
            }
        }

        for (let i = 0; i < colGunung.length; i++) {
            const colgunung = colGunung[i]
            if (
                rectangularcollision({
                    rectangle1: player,
                    rectangle2: colgunung
                })
            ) {
                location = 'Gunung'
                const mendakiBtn = document.createElement('button')
                mendakiBtn.innerText = '🥾 Mendaki (20G)'
                mendakiBtn.onclick = () => {
                    if (status.gold >= 20) {
                        audioMendaki.play();
                        status.gold -= 20
                        status.energy = Math.max(0, status.energy - 20)
                        status.hunger = Math.max(0, status.hunger - 10)
                        status.happiness = Math.min(100, status.happiness + 30)
                        showMessage('Ambatukammmm!!! +30 Happiness')
                        updateStatusBars()
                    } else {
                        showMessage('💸 Uangmu tidak cukup untuk mendaki!')
                    }
                }

                interactionMenu.appendChild(mendakiBtn)
                interactionMenu.style.display = 'block'
                break
            }
        }

        document.getElementById('locationName').innerText = location

        if (location === '') {
            interactionMenu.style.display = 'none'
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

                moving = false
                break
            }
        }
        if (moving)
            moveables.forEach(moveable => { moveable.position.x -= 3 })
    }

    const isMoving = keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed;
    if (isMoving) {
        reduceStatusOnMove(); // ⬅ Tambahkan ini di bagian bawah animate()
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
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})


// Initialize game time
let gameHours = 11;
let gameMinutes = 50;

// Track the last updated hour to avoid redundant greetings
let lastGreetingHour = -1;

// Update the greeting based on game time
function getGreetingByTime() {
    if (gameHours >= 5 && gameHours < 12) {
        return "Selamat pagi";
    } else if (gameHours >= 12 && gameHours < 15) {
        return "Selamat siang";
    } else if (gameHours >= 15 && gameHours < 18) {
        return "Selamat sore";
    } else {
        return "Selamat malam";
    }
}

function showGreeting() {
    const greetingElement = document.getElementById("greeting");
    const username = document.getElementById("usernameInput").value || "Pemain"; // Default username jika kosong
    const timeBasedGreeting = getGreetingByTime();
    greetingElement.textContent = `${timeBasedGreeting}, ${username}!`; // Set sapaan sesuai waktu
    greetingElement.style.display = "block"; // Tampilkan elemen greeting


}

// Update the clock every second
function updateClock() {
    gameMinutes += 1; // Increment 1 "minute" in-game per second in real time
    if (gameMinutes >= 60) {
        gameMinutes = 0;
        gameHours += 1;
        if (gameHours >= 24) {
            gameHours = 0; // Reset hours after 24
        }
    }

    // Format time as HH:MM
    const formattedTime = `${gameHours.toString().padStart(2, '0')}:${gameMinutes.toString().padStart(2, '0')}`;
    document.getElementById('timeDisplay').textContent = formattedTime;

    // Update greeting if the hour has changed
    if (gameHours !== lastGreetingHour) {
        lastGreetingHour = gameHours; // Update last greeting hour
        showGreeting(); // Automatically show updated greeting
    }
}

// Start the clock
setInterval(updateClock, 1000);


// Arrow key controls - lebih responsif
const arrowControls = document.getElementById('arrowControls');

// Fungsi yang lebih baik untuk handle arrow press
function handleArrowPress(direction, event) {
    event.preventDefault(); // Mencegah behavior default
    switch (direction) {
        case 'up':
            keys.w.pressed = true;
            lastkey = 'w';
            player.image = player.sprites.up;
            player.animate = true;
            break;
        case 'left':
            keys.a.pressed = true;
            lastkey = 'a';
            player.image = player.sprites.left;
            player.animate = true;
            break;
        case 'down':
            keys.s.pressed = true;
            lastkey = 's';
            player.image = player.sprites.down;
            player.animate = true;
            break;
        case 'right':
            keys.d.pressed = true;
            lastkey = 'd';
            player.image = player.sprites.right;
            player.animate = true;
            break;
    }
}

// Fungsi yang lebih baik untuk handle arrow release
function handleArrowRelease(direction, event) {
    event.preventDefault();
    switch (direction) {
        case 'up':
            keys.w.pressed = false;
            break;
        case 'left':
            keys.a.pressed = false;
            break;
        case 'down':
            keys.s.pressed = false;
            break;
        case 'right':
            keys.d.pressed = false;
            break;
    }
    // Cek jika tidak ada tombol yang ditekan
    if (!keys.w.pressed && !keys.a.pressed && !keys.s.pressed && !keys.d.pressed) {
        player.animate = false;
        player.frames.val = 0; // Reset animasi ke frame pertama
    }
}

// Event listeners yang lebih baik dengan touch support
function setupArrowControls() {
    const arrows = {
        'arrowUp': 'up',
        'arrowLeft': 'left',
        'arrowDown': 'down',
        'arrowRight': 'right'
    };

    for (const [id, direction] of Object.entries(arrows)) {
        const element = document.getElementById(id);

        // Mouse events
        element.addEventListener('mousedown', (e) => handleArrowPress(direction, e));
        element.addEventListener('mouseup', (e) => handleArrowRelease(direction, e));
        element.addEventListener('mouseleave', (e) => {
            if (keys[direction === 'up' ? 'w' : direction === 'left' ? 'a' : direction === 'down' ? 's' : 'd'].pressed) {
                handleArrowRelease(direction, e);
            }
        });

        // Touch events untuk mobile
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleArrowPress(direction, e);
        });
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleArrowRelease(direction, e);
        });
        element.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            handleArrowRelease(direction, e);
        });
    }
}

// Panggil setup saat game dimulai
document.getElementById("startGame").addEventListener("click", function () {
    // ... kode yang sudah ada ...
    setupArrowControls(); // Tambahkan ini
});


function checkAllStatus() {
    if (status.hunger <= 0 || 
        status.energy <= 0 || 
        status.hygiene <= 0 || 
        status.happiness <= 0) {
        triggerGameOver();
    }
}

function triggerGameOver() {
    document.getElementById('gameOverScreen').style.display = 'flex'

    // Optional: matikan input & interaksi
    window.removeEventListener('keydown', yourKeydownHandler) // kalau kamu pakai listener keyboard
    // bisa tambahkan flag seperti `gameRunning = false` untuk hentikan update
}