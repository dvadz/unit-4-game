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
    stage : 1
    ,characterThatWasRecentlyClicked : ""
    ,chosenCharacter : ""
    ,chosenOpponent : ""
    ,numberOfStrikes : 0
    ,challengeWinner : ""
    ,isChallangeOver : false
    ,gameOver : false
    ,hasSelectedACharacter     : false
    ,hasSelectedOpponent  : false
    ,characters : {
        "Johnny" : new GameCharacter("Johnny",15, 17),
        "Liu"    : new GameCharacter("Liu", 20, 18 ),
        "Sonya"  : new GameCharacter("Sonya", 9, 12),
        "Shang"  : new GameCharacter("Shang", 22, 20),
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
    ,setTheOpponent : function(character){
        this.chosenOpponent = character;
        if(debug){console.log("setTheOpponent:", this.chosenOpponent);}
    }
    ,getTheOpponent : function(){
        return this.chosenOpponent;
        if(debug){console.log("getTheOpponent:", this.chosenOpponent);}
    }
    ,setNextStage: function(){
        this.stage++;
        if(debug){console.log("setNextStage: ", this.stage);}
    }
    ,getWhatIsTheStage : function () {
        return this.stage;
    }
    ,strike: function() {
        if(debug) {console.log("gameMortalKombat: strike");}
        
        this.numberOfStrikes++;
        var yourHP = this.characters[this.chosenCharacter].HP;
        var yourAttackPower = this.numberOfStrikes * this.characters[this.chosenCharacter].attackPower;
        var opponentHP = this.characters[this.chosenOpponent].HP;
        var opponentAttackPower = this.characters[this.chosenOpponent].attackPower;
        if(debug) {console.log(yourHP, " ", yourAttackPower, " ", opponentHP, " ", opponentAttackPower);}

        //calculate your remaining HP
        yourHP = yourHP - opponentAttackPower;
        opponentHP = opponentHP - yourAttackPower;
        if(debug) {console.log("yourHP ", yourHP, "opponentHP: ", opponentHP);}

        //save HP 
        this.characters[this.chosenCharacter].HP = yourHP;
        this.characters[this.chosenOpponent].HP  = opponentHP;

        //check if any character has died, meaning HP <= 0
        if(yourHP<=0){
            this.characters[this.chosenCharacter].hasDied = true;
            this.isChallangeOver = true ;
            this.gameOver = true;
            if(debug){console.log("GAMEOVER!");}
        }
        if(opponentHP<=0){
            this.characters[this.chosenOpponent].hasDied = true;
            this.isChallangeOver = true ;
            buryTheDead();
            if(debug){console.log("WELL DONE, YOUR OPPONENT LOST! ARE YOU STILL ALIVE?");}
        }
        //if you are still alive and opponent has lost, set the "challengeWinner" and "isChallengeOver"
        if((this.characters[this.chosenOpponent].hasDied) && (!this.characters[this.chosenCharacter].hasDied)) {
            this.challengeWinner = this.chosenCharacter;
            this.setNextStage();
        }
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
    //setup the game
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
            moveCharacterToTheRightSide();
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
            selectYourOpponent();
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
        buryTheDead(villain);
        gameMortalKombat.hasSelectedOpponent = false;
        $("#instruction2").removeClass("hidden");
        $("#fight").addClass("hidden");
    //You lost      
    } else if (YourHP < 0) {
        if(debug){console.log("YOU LOST");}
        //set some flag
    }

}


function selectYourCharacter(character) {
    if(debug){console.log("function: selectYourCharacter");}
    gameMortalKombat.setTheChosenCharacter(character);

    //.hero class positions the character
    $("#" + character).addClass("hero");
}

function moveCharacterToTheRightSide() {
    $("#arena").removeClass("arena_0");
    $("#arena").addClass("arena_1");
}

function selectYourOpponent() {
    if(debug){console.log("function:select your opponent");}
    
    var theOpponent = gameMortalKombat.getWhoWasClicked();
    gameMortalKombat.setTheOpponent(theOpponent);

    //move the selected opponent into position to fight and flip image horizontally
    var opp = "#" + theOpponent;
    $(opp).addClass("opponent");
    $(opp + " img").addClass("opponent-flip");
    
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





// -------------------------------------------------------------------------------

function main() {
    'use strict'
    //make a sound when a character is clicked

    // check if the game is over
    if(gameMortalKombat.gameOver) {
        gameOVER();
        return false;
    }

    var stage = gameMortalKombat.getWhatIsTheStage();
}

function buryTheDead(name) {
    $("#" + gameMortalKombat.chosenOpponent).hide();
}

function gameOVER(){
    if(debug){console.log("function: gameOVER")}
    //state on screen if the player lost
    
}

