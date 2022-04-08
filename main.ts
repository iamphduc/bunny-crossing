namespace SpriteKind {
    export const Bunny = SpriteKind.create()
    export const Car = SpriteKind.create()
}
function createLevel1() {
    currentLevel = 1
    game.splash("Level 1", "Easy")
    // Map
    tiles.setCurrentTilemap(tilemap`level1`)
    tiles.placeOnTile(bunny, tiles.getTileLocation(8, 30))
    // Objects
    carRoad = [
        6,
        7,
        8,
        11,
        12,
        13,
        16,
        17,
        18,
        21,
        22,
        23,
        26,
        27,
        28
    ]
    carRoad.forEach((road) => createCar(road))
    let carrotPlace = carRoad.concat([9, 14, 24])
    carrotPlace.forEach((place) => createCarrot(place))
}
function createBunny() {
    bunny = sprites.create(assets.image`Bunny`, SpriteKind.Bunny)
    scene.cameraFollowSprite(bunny)
    // Controller
    controller.moveSprite(bunny)
    controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
        animation.runImageAnimation(bunny, [assets.image`Bunny Jumping`, assets.image`Bunny`], 300, false)
    })
    controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
        animation.runImageAnimation(bunny, [assets.image`Bunny Jumping`, assets.image`Bunny`], 300, false)
    })
    controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
        animation.runImageAnimation(bunny, [assets.image`Bunny Jumping Rev`, assets.image`Bunny Rev`], 300, false)
    })
    controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
        animation.runImageAnimation(bunny, [assets.image`Bunny Jumping Rev`, assets.image`Bunny Rev`, assets.image`Bunny Jumping Rev`,], 300, false)
    })
    controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
        animation.runImageAnimation(bunny, [assets.image`Bunny Jumping`, assets.image`Bunny`], 300, false)
    })
    controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
        animation.runImageAnimation(bunny, [assets.image`Bunny Jumping`, assets.image`Bunny`, assets.image`Bunny Jumping`], 300, false)
    })
}
function createLevel2() {
    currentLevel = 2
    // Destroy previous object
    sprites.destroyAllSpritesOfKind(SpriteKind.Car)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    // Map
    tiles.setCurrentTilemap(tilemap`level2`)
    game.splash("Level 2", "HARDER!")
    tiles.placeOnTile(bunny, tiles.getTileLocation(7, 1))
    // Objects
    carRoad2 = [
        3,
        4,
        5,
        6,
        9,
        10,
        11,
        12,
        15,
        16,
        17,
        18
    ]
    carRoad2.forEach((road) => createCar(road, true))
    let carrotPlace2 = carRoad2.concat([8, 13])
    carrotPlace2.forEach((place) => createCarrot(place))
    info.startCountdown(40)
    // Lighting Effect
    multilights.toggleLighting(true)
    multilights.addLightSource(bunny)
    multilights.bandWidthOf(bunny, 20)
}
// Sprites overlap
sprites.onOverlap(SpriteKind.Bunny, SpriteKind.Car, function (sprite, otherSprite) {
    music.pewPew.play()
    scene.cameraShake(4, 500)
    info.changeLifeBy(-1)
    if (info.life() == 0) {
        game.over(false)
    }
    if (info.life() == 1) {
        game.splash(`You have ${info.life()} life left!`)
    }
    otherSprite.destroy()
})
scene.onOverlapTile(SpriteKind.Bunny, assets.tile`myTile0`, function (sprite, location) {
    music.stopAllSounds()
    music.powerUp.play()
    game.splash("CONGRATULATION!", "That was easy?")
    createLevel2()
})
scene.onHitWall(SpriteKind.Car, function (sprite, location) {
    speedBack = [-0.95, -1, -1.05]
    sprite.vx *= speedBack[randint(0, 2)]
    sprite.image.flipX()
})
sprites.onOverlap(SpriteKind.Bunny, SpriteKind.Food, function (sprite, otherSprite) {
    music.baDing.play()
    info.changeScoreBy(1)
    otherSprite.destroy()
})
function createCarrot(place: number) {
    carrotCol = [
        1,
        3,
        4,
        6,
        8,
        9,
        11,
        13,
        14
    ]
    carrot = sprites.create(assets.image`Carrot`, SpriteKind.Food)
    tiles.placeOnTile(carrot, tiles.getTileLocation(carrotCol[randint(0, 8)], place))
}
scene.onOverlapTile(SpriteKind.Bunny, assets.tile`myTile5`, function (sprite, location) {
    if (info.score() < 20) {
        tiles.placeOnTile(bunny, tiles.getTileLocation(7, 20))
        game.splash("Oh no!", "You need at least 20 carrots to complete the game")
    } else {
        music.stopAllSounds()
        game.over(true)
    }
})
let carrot: Sprite = null
let carrotCol: number[] = []
let currentLevel = 0
let speed = 0
let direction = 0
let car: Sprite = null
let carSpeed: number[] = []
let carDirection: number[] = []
let carList: Image[] = []
let speedBack: number[] = []
let bunny: Sprite = null
let carRoad: number[] = []
let carRoad2: number[] = []
function createCar(road: number, isFaster = false) {
    carList = [assets.image`Red Car`, assets.image`Blue Car`, assets.image`Purple Car`]
    carDirection = [1, 14]
    carSpeed = [
        140,
        160,
        180,
        200
    ]
    car = sprites.create(carList[randint(0, 2)], SpriteKind.Car)
    direction = carDirection[randint(0, 1)]
    speed = carSpeed[randint(0, 3)]
    tiles.placeOnTile(car, tiles.getTileLocation(direction, road))
    car.vx = speed * (isFaster ? 1.2 : 1)
    // If car is created from other side
    if (direction == 14) {
        car.image.flipX()
        car.vx *= -1
    }
}
info.setLife(5)
createBunny()
createLevel1()
forever(function () {
    music.playMelody("C E F G F G A B ", 180)
    music.playMelody("B E F A G F A B ", 180)
})
