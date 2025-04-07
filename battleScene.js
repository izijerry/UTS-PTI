const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let draggle
let emby
let renderedSprites
let battleAnimationId
let queue = []

const goldDropTable = [
    { gold: 5, chance: 40 },
    { gold: 10, chance: 30 },
    { gold: 20, chance: 20 },
    { gold: 50, chance: 9 },
    { gold: 100, chance: 0.9},
    { gold: 999, chance: 0.1},
  ]

function getRandomGoldByDropRate() {
    const random = Math.random() * 100
    let cumulative = 0
  
    for (const drop of goldDropTable) {
      cumulative += drop.chance
      if (random < cumulative) {
        return drop.gold
      }
    }
  
    return 0 // fallback
  }

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialoguebox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    // happiness berkurang saat battle
    status.happiness -= 20
    if (status.happiness < 0) status.happiness = 0
    updateStatusBars()
    showMessage('😫 Kamu merasa stres karena harus bertarung! -20 Happiness')

    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderedSprites = [draggle, emby]
    queue = []

    emby.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    // our event listener for our buttons (attack)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            })

            if (draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint()
                })

                queue.push(() => {
                    const reward = getRandomGoldByDropRate()
                    status.gold += reward
                    updateStatusBars()
                  
                    const dialog = document.querySelector('#dialogueBox')
                    dialog.innerText = `You received ${reward} gold!`
                    dialog.style.display = 'block'
                  })

                queue.push(() => {
                    // fade back to black
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'

                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })

                            battle.initated = false
                            audio.Map.play()
                        }
                    })
                })
            }

            // draggle or enemy attacs right here
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                })

                if (emby.health <= 0) {
                    queue.push(() => {
                        emby.faint()
                    })
                    queue.push(() => {
                        // fade back to black
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'

                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                })

                                battle.initated = false
                                audio.Map.play()
                            }
                        })
                    })
                }
            })
        })
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    console.log(battleAnimationId)

    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}

//initBattle()
//animateBattle()
animate()





document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
    console.log('clicked dialogue')
})