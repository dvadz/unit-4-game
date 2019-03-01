'use strict'
var debug = false;

function GameCharacter(name, hp, attackPower,counterAttackPower) {
    this.name = name;
    this.HP = hp;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
}

var gameMortalKombat = {
    characterThatWasRecentlyClicked : ""
    ,chosenCharacter : ""
    ,chosenOpponent : ""
    ,numberOfStrikes : 0
    ,numberOfWins : 0
    ,hasSelectedACharacter: false
    ,hasSelectedOpponent  : false
    ,gameOver: false
    ,characters : {
        "Johnny" : new GameCharacter("Johnny", 140, 15, 19),
        "Liu"    : new GameCharacter("Liu"   , 150, 18, 20),
        "Sonya"  : new GameCharacter("Sonya" , 130, 12, 15),
        "Shang"  : new GameCharacter("Shang" , 160, 19, 25),
    }
    ,init : function() {
        this.characterThatWasRecentlyClicked = "";
        this.chosenCharacter = "";
        this.chosenOpponent = "";
        this.numberOfStrikes = 0;
        this.numberOfWins = 0;
        this.hasSelectedACharacter= false;
        this.hasSelectedOpponent  = false;
        this.gameOver= false;
    }
    ,getNameOfCharacters: function() {
        return this.characters;
    }
    ,getWhoWasClicked : function(){
        if(debug){console.log("getWhoWasClicked: ", this.characterThatWasRecentlyClicked);}
        return this.characterThatWasRecentlyClicked;
    }    
    ,setWhoWasClicked : function(character){
        this.characterThatWasRecentlyClicked = character;
        if(debug){console.log("setWhoWasClicked: ", this.characterThatWasRecentlyClicked);}
    }
    ,setTheChosenCharacter: function(character) {
        this.chosenCharacter = character;
        if(debug){console.log("setTheChosenCharacter: ", this.chosenCharacter);}
    }
    ,getWhoIsTheChosenCharacter: function() {
        if(debug){console.log("getWhoIsTheChosenCharacter:", this.chosenCharacter);}
        return this.chosenCharacter;
    }
};

var sounds = {
     themeSong : new Audio("./assets/sounds/Mortal_Kombat_theme.mp3")
     ,fatal: new Audio("./assets/sounds/fatality_scream.mp3")
     ,round :[
        new Audio("./assets/sounds/round1.mp3")
        ,new Audio("./assets/sounds/round2.mp3")
        ,new Audio("./assets/sounds/round3.mp3")
     ]
     ,fight: new Audio("./assets/sounds/fight.mp3")
     ,isthemeSongPlaying : false
     ,toggleThemeSong: function() {
        if(this.isthemeSongPlaying) {
            this.themeSong.pause();
            this.themeSong.currentTime = 0;
            if(debug){console.log("stopping song");}
            this.isthemeSongPlaying = false;
        } else {
            this.themeSong.play();
            this.themeSong.loop = true;
            if(debug){console.log("playing song");}
            this.isthemeSongPlaying = true;
        }
    }
};

$(document).ready(function(){
    sounds.toggleThemeSong();

    drawTheCharacters();

    $(".speaker").on("click", function(){
        sounds.toggleThemeSong();
        if(debug){console.log("toggle song");}
    });

    //CLICK ON THE CHARACTERS
    $("#arena").on("click", function(event){

        if(gameMortalKombat.gameOver) {
            //make a defeated shout
            return false;
        }

        //get the name of the character and save it
        var character = event.target.alt;
        if(debug){console.log("EVENT .characters: ",event);}
        // if(debug){console.log("EVENT .characters: ",character);}
 
        gameMortalKombat.setWhoWasClicked(character);

        //player selects a character
        if(!gameMortalKombat.hasSelectedACharacter) {
            gameMortalKombat.hasSelectedACharacter = true;
            selectYourCharacter(character);
            moveCharactersToTheRightSide();
            $("#instruction1").addClass("hidden");
            $("#instruction2").removeClass("hidden");

        //player selects an opponent
        } else if(!gameMortalKombat.hasSelectedOpponent) {
            //make sure this isn't the player's character
            if(gameMortalKombat.chosenCharacter===character) {
                return false;
            }
            gameMortalKombat.getWhoWasClicked
            gameMortalKombat.hasSelectedOpponent = true;
            selectYourOpponent(character);
            $("#instruction2").addClass("hidden");
            $("#fight").removeClass("hidden");
            //hide the characters
            $(".sideline").addClass("hidden");
            playFightSound();

        } else {
            //error?
            if(debug){console.log("WHAT'S THE FUZZ ALL ABOUT?");}
        }
    });

    //FIGHT BUTTON
    $("#fight").on("click", function(){
        if(debug){console.log("EVENT #fight: ");}
        kombat();
    });

    //PLAY AGAIN BUTTON
    $(".play_again").on("click", function(){
        if(debug){console.log("EVENT .play_again")}

        //reset the arena 
        $("#arena").empty().removeClass("arena_1").addClass("arena_0");
        drawTheCharacters();
        // reset variables in gameMortalKombat 
        gameMortalKombat.init();
        //hide the messages except for #1
        $(".messages").addClass("hidden");
        $("#instruction1").removeClass("hidden");
        //hide all buttons
        $(".buttons").addClass("hidden");

    });

});

function playFightSound() {
    sounds.round[gameMortalKombat.numberOfWins].play();
    var round_fight = setTimeout(function(){
        sounds.fight.play();
    },2000); 
}

function kombat() {
    'use strict'
    var you = gameMortalKombat.chosenCharacter;
    var villain = gameMortalKombat.chosenOpponent;
    if(debug){console.log("function: kombat", you, " VS ", villain);}

    //get your player's stats
    var YourHP = $("#" + you).attr("hp");
    var YourAttackPower = $("#" + you).attr("attackPower");
    var YourCounterAttackPower = $("#" + you).attr("counterAttackPower");
    if(debug){console.log("Before ", YourHP, " ",YourAttackPower, " ", YourCounterAttackPower);}
    
    //get your opponent's stats
    var VillainHP = $("#" + villain).attr("hp");
    var VillainAttackPower = $("#" + villain).attr("attackPower");
    var VillainCounterAttackPower = $("#" + villain).attr("counterAttackPower");
    if(debug){console.log("Before ",VillainHP, " ",VillainAttackPower, " ", VillainCounterAttackPower);}
    
    gameMortalKombat.numberOfStrikes++;

    //reduce the opponent's HP by (YourAttackPower * #strikes)
    var totalAttackPower = parseInt(YourAttackPower) * parseInt(gameMortalKombat.numberOfStrikes);
    VillainHP = parseInt(VillainHP) - parseInt(totalAttackPower);
    //check if negative, if so, set to zero
    VillainHP = (VillainHP < 0) ? 0 : VillainHP;
    $(`#${villain}`).attr("hp", VillainHP);
    $(`#${villain} span#displayHP`).text(VillainHP);

    //reduce the hero's HP by the villain's CounterAttackPower alone
    YourHP = parseInt(YourHP) - parseInt(VillainCounterAttackPower);
    YourHP = (YourHP < 0) ? 0 : YourHP;
    $("#" + you).attr("hp", YourHP);
    $(`#${you} span#displayHP`).text(YourHP);

    if(debug){console.log("After ", YourHP, " ",YourAttackPower, " ", YourCounterAttackPower);}
    if(debug){console.log("After ",VillainHP, " ",VillainAttackPower, " ", VillainCounterAttackPower);}

    //check if anyone has won
    //You won
    if(YourHP > 0 && VillainHP <= 0) {
        if(debug){console.log("YOU WON THIS ROUND");}
        buryTheDead();
        gameMortalKombat.hasSelectedOpponent = false;
        $("#fight").addClass("hidden");
        //show the characters
        $(".sideline").removeClass("hidden");
        //increment the number of wins then check if all 3 opponents have been defeated
        gameMortalKombat.numberOfWins++;
        if(gameMortalKombat.numberOfWins===3){
            gameMortalKombat.gameOver = true;
            if(debug) {console.log("YOU WON!")};
            //play music
            $(".hero").removeClass("characters hero").addClass("gameover");
            $("#victory").removeClass("hidden");
            //show 'Play Again'
            $(".play_again").removeClass("hidden");
            return false;
        } else {
            //display instruction to pick another opponent
            $("#instruction2").removeClass("hidden");
        }
    //You lost         
    } else if (YourHP===0) {
        if(debug){console.log("YOU LOST");}
        gameMortalKombat.gameOver = true;
        buryTheDead();
        $("#fight").addClass("hidden");
        $(".hero").removeClass("characters hero").addClass("gameover");
        //diplay message that you lost
        $("#defeat").removeClass("hidden");
        //show 'Play Again'
        $(".play_again").removeClass("hidden");
    }
}

function selectYourCharacter(character) {
    if(debug){console.log("function: selectYourCharacter");}
    gameMortalKombat.chosenCharacter = character;

    //.hero class positions the character
    $("#" + character).addClass("hero").removeClass("sideline");
}

function moveCharactersToTheRightSide() {
    $("#arena").removeClass("arena_0");
    $("#arena").addClass("arena_1");
}

function selectYourOpponent(character) {
    if(debug){console.log("function:select your opponent");}
    
    gameMortalKombat.chosenOpponent = character;

    //move the selected opponent into position to fight and flip image horizontally
    var opp = "#" + character;
    $(opp).addClass("opponent").removeClass("sideline");
    $(opp + " img").addClass("opponent-flip");  
}

function buryTheDead() {
    $("#" + gameMortalKombat.chosenOpponent).hide();
    sounds.fatal.play();
}

function drawTheCharacters() {

    //convert the character object into an array to run the forEach
    var arrayOfCharactersNames  = Object.keys(gameMortalKombat.getNameOfCharacters());
    if(debug){console.log(arrayOfCharactersNames);}
    arrayOfCharactersNames.forEach(function(character){
        if(debug){console.log(character);}
        
        var name = character;
        var hp = gameMortalKombat.characters[character].HP;
        var attackPower = gameMortalKombat.characters[character].attackPower;
        var counterAttackPower = gameMortalKombat.characters[character].counterAttackPower;
        
        //create a "card" for each character
        //the card will have an image, name and have a copy of the HP, Attack, Counter Attack, etc
        var card = $("<div>");
        card.addClass("characters card sideline " + character);
        card.attr({
            "id": character,
            "name": name,
            "hp": hp,
            "attackPower": attackPower,
            "counterAttackPower": counterAttackPower
        });

        //add an img and append it to the card
        var image = $("<img>");
        var imageSrc = `./assets/images/${name}.jpg`
        if(debug){console.log(imageSrc);}
        image.attr({
            "src": imageSrc,
            "alt": name,
        });
        image.addClass("image");
        card.append(image);

        //this will show the name and HP
        // <div><h3>Name<span>HP</span></h3></div>
        var caption = $("<div>").addClass('card-caption');
        var displayName = $("<span>").text(character); 
        var displayHP = $("<span id = 'displayHP'></span>").text(hp);
        caption.append(displayName);
        caption.append(displayHP);
        card.append(caption);

        //append the 'card' to the arena div
        $("#arena").append(card);
    });
}
