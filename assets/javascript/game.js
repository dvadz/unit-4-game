'use strict'
var debug = true;

function GameCharacter(name, attackPower,counterAttackPower) {
    this.name = name;
    this.HP = 150;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.hasDied = false;
    this.chosenOne = false;
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
        "Johnny" : new GameCharacter("Johnny",21, 17),
        "Liu"    : new GameCharacter("Liu", 20, 18 ),
        "Sonya"  : new GameCharacter("Sonya", 19, 15),
        "Shang"  : new GameCharacter("Shang", 20, 20),
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
    //sounds.toggleThemeSong();

    drawTheCharacters();

    $(".speaker").on("click", function(){
        sounds.toggleThemeSong();
        if(debug){console.log("toggle song");}
    });

    $(".characters").on("click", function(){
        //get the name of the character and save it
        var character = this.id;
        if(debug){console.log("EVENT .characters: ",character);}
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

        } else {
            //error?
            if(debug){console.log("WHAT'S THE FUZZ ALL ABOUT?");}
        }
    });

    $("#fight").on("click", function(){
        if(debug){console.log("EVENT #fight: ");}
        kombat();
    });

});

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

    //reduce the opponent's HP by (YourAttackPower * #strikes from)
    var totalAttackPower = parseInt(YourAttackPower) * parseInt(gameMortalKombat.numberOfStrikes);
    VillainHP = parseInt(VillainHP) - parseInt(totalAttackPower);
    $("#" + villain).attr("hp", VillainHP)

    //reduce the hero's HP by the villain's CounterAttackPower only
    YourHP = parseInt(YourHP) - parseInt(VillainCounterAttackPower);
    $("#" + you).attr("hp", YourHP);

    if(debug){console.log("After ", YourHP, " ",YourAttackPower, " ", YourCounterAttackPower);}
    if(debug){console.log("After ",VillainHP, " ",VillainAttackPower, " ", VillainCounterAttackPower);}

    //check if anyone has won
    //You won
    if(YourHP > 0 && VillainHP <= 0) {
        if(debug){console.log("YOU WON THIS ROUND");}
        buryTheDead();
        gameMortalKombat.hasSelectedOpponent = false;
        $("#fight").addClass("hidden");
        
        //increment the numberof wins then check if all 3 opponents have been defeated
        gameMortalKombat.numberOfWins++;
        if(gameMortalKombat.numberOfWins===3){
            gameMortalKombat.gameOver = true;
            console.log("CONGRATULATIONS YOU DEFEATED ALL ENEMIES!");
            //play music
            return false;
        } else {
            $("#instruction2").removeClass("hidden");
        }
    //You lost      
    } else if (YourHP < 0) {
        if(debug){console.log("YOU LOST");}
        //set some flag

    }
}

function selectYourCharacter(character) {
    if(debug){console.log("function: selectYourCharacter");}
    gameMortalKombat.chosenCharacter = character;

    //.hero class positions the character
    $("#" + character).addClass("hero");
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
    $(opp).addClass("opponent");
    $(opp + " img").addClass("opponent-flip");  
}

function buryTheDead() {
    $("#" + gameMortalKombat.chosenOpponent).hide();
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
        card.addClass("characters " + character);
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

        //this will show the name of the character
        var title = $("<h3 class='white'>").text(character);
        card.append(title);

        $("#arena").append(card);
    });
}
